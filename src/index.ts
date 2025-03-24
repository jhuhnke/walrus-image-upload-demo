import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const WALRUS_BIN = process.env.WALRUS_BIN || '/usr/local/bin/walrus'; // Adjust if needed
const WALRUS_CONFIG = process.env.WALRUS_CONFIG || path.join(process.env.HOME || '', '.config/walrus/client_config.yaml');

// ✅ Simple POSIX path handling
const IMAGE_FILENAME = 'rug-example.jpg';
const IMAGE_PATH = path.join(__dirname, '..', 'public', IMAGE_FILENAME);

async function uploadAndDownloadWalrus() {
  console.log('📤 Uploading to Walrus...');
  console.log(`➡️  Uploading file from: ${IMAGE_PATH}`);

  if (!fs.existsSync(IMAGE_PATH)) {
    console.error('❌ Image not found at:', IMAGE_PATH);
    return;
  }

  const storeJson = JSON.stringify({
    config: WALRUS_CONFIG,
    command: {
      store: {
        files: [IMAGE_PATH],
        epochs: 2,
      },
    },
  });

  const upload = spawnSync(WALRUS_BIN, ['json'], {
    input: storeJson,
    encoding: 'utf-8',
  });

  if (upload.error || upload.status !== 0) {
    console.error('❌ Upload failed:', upload.stderr || upload.stdout);
    console.error('🔎 Raw output:', JSON.stringify(upload, null, 2));
    return;
  }

  const uploadResult = JSON.parse(upload.stdout.trim())[0].blobStoreResult;
  let blobId: string;
  let suiObjectId: string | undefined;

  if (uploadResult.newlyCreated) {
    blobId = uploadResult.newlyCreated.blobObject.blobId;
    suiObjectId = uploadResult.newlyCreated.blobObject.id;
  } else if (uploadResult.alreadyCertified) {
    blobId = uploadResult.alreadyCertified.blobId;
  } else {
    throw new Error('Unexpected Walrus response');
  }

  console.log(`✅ Uploaded Blob ID: ${blobId}`);
  if (suiObjectId) console.log(`✅ Certified SUI Object ID: ${suiObjectId}`);

  console.log('📥 Downloading blob from Walrus...');

  const readJson = JSON.stringify({
    config: WALRUS_CONFIG,
    command: {
      read: { blobId },
    },
  });

  const download = spawnSync(WALRUS_BIN, ['json'], {
    input: readJson,
    encoding: 'utf-8',
  });

  if (download.error || download.status !== 0) {
    console.error('❌ Download failed:', download.stderr || download.stdout);
    return;
  }

  const downloadResult = JSON.parse(download.stdout.trim());
  const blobData = Buffer.from(downloadResult.blob, 'base64');
  console.log(`✅ Downloaded Blob Size: ${blobData.length} bytes`);

  // ✅ Save the downloaded blob back into the public folder
  const downloadedPath = path.join(__dirname, '..', 'public', 'downloaded.jpg');
  fs.writeFileSync(downloadedPath, blobData);
  console.log(`✅ Downloaded image saved to: ${downloadedPath}`);
}

uploadAndDownloadWalrus();
