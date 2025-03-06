import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Initialize AWS S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

/**
 * Middleware for handling file uploads to AWS S3.
 * Stores images in `s3/{userId}/images/` with a timestamped filename.
 */
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            if (!req.user || !req.user.id) {
                return cb(new Error("User ID is missing"), null);
            }
            const userId = req.user.id;
            const filename = `${Date.now()}-${file.originalname}`;
            const filePath = `${userId}/images/${filename}`;  // Store in `s3/{userId}/images/`
            cb(null, filePath);
        }
    })
});

export default upload;
