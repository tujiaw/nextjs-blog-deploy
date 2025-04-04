'use client';

import { useState, useRef, useEffect } from 'react';
import { s3Client } from '../../../lib/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
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
          if (file.size > MAX_FILE_SIZE) {
            setError(`File ${file.name} exceeds the 30MB size limit`);
            continue;
          }
          newFiles.push(file);
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
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">File Upload</h1>
      
      <div className="space-y-4">
        <div 
          ref={dropZoneRef}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6"
          tabIndex={0}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full"
            accept="image/*,.pdf,.doc,.docx,.txt"
            multiple
          />
          <p className="text-sm text-gray-500 mt-2">
            Maximum {MAX_FILES} files, 30MB per file
          </p>
          <p className="text-sm text-gray-500 mt-1">
            You can also paste images directly from your clipboard (Ctrl+V)
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Selected Files:</h3>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600 truncate">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className={`w-full py-2 px-4 rounded ${
            files.length === 0 || uploading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
        </button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {uploadedUrls.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm font-medium text-gray-700">Upload successful!</p>
            <div className="mt-2 space-y-2">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <p className="text-sm text-gray-600 break-all flex-1 mr-2">
                    {url}
                  </p>
                  <button
                    onClick={() => copyToClipboard(url, index)}
                    className={`px-3 py-1 text-sm rounded ${
                      copiedIndex === index
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
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