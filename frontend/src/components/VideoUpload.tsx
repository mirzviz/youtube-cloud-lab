import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { videoService } from '../api/videoService';

const VideoUpload: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== 'video/mp4') {
        setError('Please select an MP4 file');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      setError('Please select a file and provide a title');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const newVideoId = crypto.randomUUID();
      const newFilename = `${newVideoId}.mp4`;

      // Get presigned URL and upload file
      const uploadUrl = await videoService.getUploadUrl(newFilename);
      await videoService.uploadVideo(uploadUrl, selectedFile);

      // Register video metadata
      await videoService.registerVideo({
        videoId: newVideoId,
        title,
        description: description || '',
        s3Key: newFilename
      });

      setUploadComplete(true);
      // Wait for 2 seconds to show the success message before redirecting
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  if (uploadComplete) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload Complete!</h2>
          <p className="text-gray-600 dark:text-gray-300">Your video has been successfully uploaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Upload Video</h1>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="video/mp4"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className={`cursor-pointer block p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {selectedFile ? (
                  <p>Selected: {selectedFile.name}</p>
                ) : (
                  <p>Click to select an MP4 video file</p>
                )}
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Enter video description"
                  rows={4}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600">{error}</div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || !title || uploading}
              className={`w-full px-6 py-3 rounded-lg ${
                !selectedFile || !title || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium`}
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload; 