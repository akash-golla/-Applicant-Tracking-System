import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AWS from 'aws-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const s3Client = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION && process.env.AWS_S3_BUCKET_NAME
  ? new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

export const uploadResumeToStorage = async (filePath, originalName, mimeType = 'application/octet-stream') => {
  const normalizedName = path.basename(originalName || filePath);
  const destinationPath = path.join(uploadDir, normalizedName);

  try {
    if (s3Client && process.env.AWS_S3_BUCKET_NAME) {
      const fileBuffer = fs.readFileSync(filePath);
      const key = `resumes/${Date.now()}-${normalizedName}`;
      await s3Client
        .putObject({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
          ACL: 'public-read',
        })
        .promise();

      return {
        url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        storage: 's3',
        filePath: key,
      };
    }

    fs.copyFileSync(filePath, destinationPath);
    return {
      url: `/uploads/${normalizedName}`,
      storage: 'local',
      filePath: destinationPath,
    };
  } catch (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }
};
