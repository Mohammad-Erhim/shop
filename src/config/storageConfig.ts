export const storageConfig = {
  type: process.env.STORAGE_TYPE || 'local', // 'local' or 's3'
  s3: {
    endPoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:9000',
    accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
    bucketName: process.env.S3_BUCKET_NAME || 'my-bucket',
    useSSL: process.env.S3_USE_SSL === 'true',
  },
  local: {
    uploadDir: process.env.LOCAL_UPLOAD_DIR || 'local-bucket',
    localBaseURL: process.env.LOCAL_FILE_BASE_URL || 'http://127.0.0.1:3000',
    localEntryURL: process.env.LOCAL_FILE_ENTRY || 'bucket',
  },
  expirationTime: parseInt(process.env.EXPIRATION_TIME || '3600', 10), // in seconds
};
