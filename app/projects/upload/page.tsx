'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MAX_FILES = 5;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handlePaste = async (e: ClipboardEvent) => {
      e.preventDefault();
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
      if (imageItems.length === 0) return;

      // Check if adding new files would exceed the limit
      if (files.length + imageItems.length > MAX_FILES) {
        setError(`You can only upload up to ${MAX_FILES} files at once`);
        return;
      }

      const newFiles: File[] = [];
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          // Create a new File object with a proper name and type
          const timestamp = new Date().getTime();
          const extension = file.type.split('/')[1] || 'png';
          const newFile = new File([file], `pasted-image-${timestamp}.${extension}`, {
            type: file.type
          });

          if (newFile.size > MAX_FILE_SIZE) {
            setError(`File ${newFile.name} exceeds the 30MB size limit`);
            continue;
          }
          newFiles.push(newFile);
        }
      }

      if (newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
        setError('');
        setUploadedUrls([]);
      }
    };

    dropZone.addEventListener('paste', handlePaste);
    return () => dropZone.removeEventListener('paste', handlePaste);
  }, [files.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check if adding new files would exceed the limit
      if (files.length + newFiles.length > MAX_FILES) {
        setError(`You can only upload up to ${MAX_FILES} files at once`);
        return;
      }

      // Check file sizes
      const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the 30MB size limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }

      setFiles(prev => [...prev, ...newFiles]);
      setError('');
      setUploadedUrls([]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sanitizeFileName = (fileName: string): string => {
    // Remove special characters and spaces, replace with hyphens
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getFileNameWithoutExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  };

  const getFileExtension = (fileName: string): string => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      // Less than 1MB, show in KB
      return `${(bytes / 1024).toFixed(2)}KB`;
    }
    // Show in MB
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const newUploadedUrls: string[] = [];

      for (const file of files) {
        // Create a unique file name with original name
        const timestamp = new Date().getTime();
        const originalName = file.name;
        const nameWithoutExt = getFileNameWithoutExtension(originalName);
        const extension = getFileExtension(originalName);
        const sanitizedName = sanitizeFileName(nameWithoutExt);
        const fileName = `${sanitizedName}-${timestamp}${extension}`;
        const filePath = `uploads/${fileName}`;

        // Upload file to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'uploads')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'uploads')
          .getPublicUrl(filePath);

        newUploadedUrls.push(publicUrl);
      }

      setUploadedUrls(newUploadedUrls);
      setFiles([]); // Clear files after successful upload
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6 dark:bg-gray-900">      
      <div className="space-y-4">
        <div 
          ref={dropZoneRef}
          className="rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-600 dark:bg-gray-800"
          tabIndex={0}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full dark:text-gray-200"
            accept="image/*,.pdf,.doc,.docx,.txt"
            multiple
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Maximum {MAX_FILES} files, 30MB per file
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You can also paste images directly from your clipboard (Ctrl+V)
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium dark:text-gray-200">Selected Files:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-800"
              >
                <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                  {file.name} ({formatFileSize(file.size)})
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="rounded-full p-1 text-red-500 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                  title="Remove file"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className={`w-full rounded px-4 py-2 ${
            files.length === 0 || uploading
              ? 'cursor-not-allowed bg-gray-300 dark:bg-gray-700 dark:text-gray-400'
              : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
        </button>

        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">
            {error}
          </div>
        )}

        {uploadedUrls.length > 0 && (
          <div className="mt-4 rounded bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Upload successful!
            </p>
            <div className="mt-2 space-y-2">
              {uploadedUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded border bg-white p-2 dark:border-gray-600 dark:bg-gray-700"
                >
                  <span className="mr-2 flex-1 break-all text-sm text-gray-600 dark:text-gray-300">
                    {url}
                  </span>
                  <button
                    onClick={() => copyToClipboard(url, index)}
                    className="rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Copy URL"
                  >
                    {copiedIndex === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 