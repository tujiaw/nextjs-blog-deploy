import { S3Client } from '@aws-sdk/client-s3';

// Create an S3 client for direct S3 operations
export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for some S3-compatible services like MinIO
}); 