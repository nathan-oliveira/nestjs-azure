import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Express } from 'express';

@Injectable()
export class AppService {
  container = 'upload-file';

  // video de como configurar azure: https://www.youtube.com/watch?v=hIAKzDz09tc
  getStringConnection() {
    const accountName = process.env.AZURE_BLOB_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_BLOB_ACCOUNT_KEY;
    return `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
  }

  getBlockBlobClient(filename: string): BlockBlobClient {
    const azureConnection = this.getStringConnection();
    const blobClient = BlobServiceClient.fromConnectionString(azureConnection);
    const blobContainer = blobClient.getContainerClient(this.container);
    return blobContainer.getBlockBlobClient(filename);
  }

  async uploadImage(file: Express.Multer.File) {
    const blockBlobClient = this.getBlockBlobClient(file.originalname);
    await blockBlobClient.uploadData(file.buffer);
  }

  async readStream(filename: string) {
    const blockBlobClient = this.getBlockBlobClient(filename);
    const blobDownload = await blockBlobClient.download(0);
    return blobDownload.readableStreamBody;
  }

  async delete(filename: string) {
    const blockBlobClient = this.getBlockBlobClient(filename);
    await blockBlobClient.deleteIfExists();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
