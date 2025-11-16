import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    type: "service_account",
    private_key_id: process.env.GOOGLE_STORAGE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY,
    client_id: process.env.GOOGLE_STORAGE_CLIENT_ID,
    client_email: process.env.GOOGLE_STORAGE_CLIENT_EMAIL,
  },
});

/**
 * ## Storage Bucket
 * @description The Google Cloud Storage Bucket that stores files on the cloud.
 */
const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME!);
export default bucket;
