# Walrus Image Upload Demo 

This project provides a Typescript demo for uploading an image to Walrus storage on the SUI Testnet using the Walrus CLI binary. It demonstrates how to: 

- Upload an image file as a blob
- Receive a certified SUI Object ID
- Download the blob back 
- Understand how Walrus stores off-chain data linked to on-chain SUI objects

---

## Requirements 
- Node.js (v18+ recommended)
- ```ts-node```
- ```walrus``` binary installed 
- Walrus ```client_config.yaml``` properly configured 
- Image file place in ```public/``` folder 

---

## Environment Setup 
Create a ```.env``` file: 
```
WALRUS_BIN=
WALRUS_CONFIG=
```

Directory Structure: 
```
walrus-image-upload-demo/
├── src/index.ts
├── public/rug-example.jpg
├── public/downloaded.jpg (created after download)
├── .env
```

---
## How The Script Works 
**1. Upload an Image to Walrus**
- Reads the image from ```public/```
- Builds a JSON payload for the Walrus CLI 
- Calls the Walrus binary with ```spawnSync```
- Receives: 
    - ```blobId``` - the identifier of the stored blob
    - ```suiObjectId``` - the certified SUI object created on-chain

**2. Download the Blob from Walrus**
- Requests the blob using the same ```blobId```
- Decodes the blob data from base64
- Saves the downloaded file to ```public/downloaded.jpg```

---

## Example Output 
```
📤 Uploading to Walrus...
➡️  Uploading file from: /Users/your_user/walrus-image-upload-demo/public/rug-example.jpg
✅ Uploaded Blob ID: d6FijSlrtRd9C_hkZYnXgqqiqAxP_pxx9gi9Qskw-Xs
✅ Certified SUI Object ID: 0xe63a770088ef7d3f5a1520cc977498fa046fb49d6863426fd84c67890944b522
📥 Downloading blob from Walrus...
✅ Downloaded Blob Size: 129986 bytes
✅ Downloaded image saved to: /Users/your_user/walrus-image-upload-demo/public/downloaded.jpg
```

--- 

## Viewing the SUI Object On-Chain
**SUI Testnet Explorer**
```
https://sui-explorer.com/object/<SUI_OBJECT_ID>?network=testnet
```

Example: 
```
https://sui-explorer.com/object/0xe63a770088ef7d3f5a1520cc977498fa046fb49d6863426fd84c67890944b522?network=testnet
```

**What You'll See**
- ```blob_id```
- Size 
- Encoding
- Storage Metadata

**Note:** The image itself is NOT stored on-chain -- only the metadata and ```blob_id``` are. 

---

## Retrieving the Blob From Walrus 

Once you have the ```blobId```, you can downlaod the blob directly via the aggregator: 

```
https://aggregator.walrus-testnet.walrus.space/v1/blobs/<blob_id>
```

Example: 
```
https://aggregator.walrus-testnet.walrus.space/v1/blobs/d6FijSlrtRd9C_hkZYnXgqqiqAxP_pxx9gi9Qskw-Xs
```

This returns the raw image bytes. 

--- 

## Notes of Walrus Design: 
- Blob data is **stored off-chain.**
- **SUI stores a certified object** containing metadata and ```blob_id```
- Renderers (like explorers) **don't fetch the image automatically**
- To render the image, use the ```blob_id``` and fetch it from the Walrus API

---

## Running the Script 
```
npm install 
tsx src/index.ts
```

---

## Next Steps 
- Build a frontend that fetches blobs using ```blob_id```
- Render stored images dynamically 
- Add ```sui_getObject``` RPC verification of on-chain blob metadata. 
