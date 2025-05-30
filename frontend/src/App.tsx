import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [filename, setFilename] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== 'video/mp4') {
        setError('Please select an MP4 file')
        return
      }
      setFile(selectedFile)
      setError('')
      // Set default filename from the selected file
      setFilename(selectedFile.name)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || !filename) {
      setError('Please select a file and provide a filename')
      return
    }

    setIsUploading(true)
    setError('')
    
    try {
      // Get the presigned URL
      const response = await fetch('https://7ehv3qnn63.execute-api.eu-north-1.amazonaws.com/dev/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      })

      if (!response.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl } = await response.json()

      // Upload the file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'video/mp4',
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      setUploadComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Video Upload</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Select MP4 Video
            </label>
            <input
              type="file"
              id="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700">
              Filename
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                p-2 border"
              placeholder="Enter filename"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {uploadComplete && (
            <div className="text-green-600 text-sm">Upload complete!</div>
          )}

          <button
            type="submit"
            disabled={isUploading || !file || !filename}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
              ${isUploading || !file || !filename
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
