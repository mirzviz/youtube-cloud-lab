import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'
import { LoginButton } from './components/LoginButton'
import { LogoutButton } from './components/LogoutButton'
import { useAuth } from './hooks/useAuth'
import { useDarkMode } from './hooks/useDarkMode'

function App() {
  const { isAuthenticated, isLoading, user, getAuthToken } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [file, setFile] = useState<File | null>(null)
  const [filename, setFilename] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [_, setVideoId] = useState<string>('')
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
      setFilename(selectedFile.name)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || !filename || !title) {
      setError('Please select a file, provide a filename, and title')
      return
    }

    setIsUploading(true)
    setError('')
    
    try {
      const newVideoId = crypto.randomUUID()
      setVideoId(newVideoId)
      const newFilename = `${newVideoId}.mp4`
      console.log(newFilename);
      setFilename(newFilename)

      const idToken = await getAuthToken();
      if (!idToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('https://7ehv3qnn63.execute-api.eu-north-1.amazonaws.com/dev/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ filename: newFilename }),
      })

      if (!response.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl } = await response.json()

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

      // Register video metadata
      const metadataResponse = await fetch('https://7ehv3qnn63.execute-api.eu-north-1.amazonaws.com/dev/register-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          videoId: newVideoId,
          title,
          description: description || '',
          createdAt: new Date().toISOString()
        }),
      })

      if (!metadataResponse.ok) {
        throw new Error('Failed to register video metadata')
      }

      console.log('Video uploaded successfully:', {
        videoId: newVideoId,
        title,
        description: description || '(no description)'
      });

      setUploadComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="fixed top-4 right-4 z-50 flex gap-2 items-center">
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow"
          aria-label="Toggle dark mode"
        >
          {isDark ? '🌙 Dark' : '☀️ Light'}
        </button>
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Video Upload</h1>
            {isAuthenticated && user && (
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Welcome, {user.name}
              </p>
            )}
          </div>
          
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Please log in to upload videos</p>
            </div>
          ) : (
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    p-2 border"
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    p-2 border"
                  placeholder="Enter video description"
                  rows={3}
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
          )}
        </div>
      </div>
    </div>
  )
}

export default App
