import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import csv from 'csv-parser';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');

const csvUrls = {
  users: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Users%20(1)-KaVk6ZgftMY06mIp2rLkhWLBgF7O0Q.csv',
  products: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Product%20List%20(2).csv-7x7LH4kYVALYVmvZaqQ4LZtPehaKMg.csv',
  companies: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SMB-Companies%20(2)-ZHdBmXXHDh3KXHzoXEVcml8xErAlUV.csv'
};

async function createDataFolder() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    console.log('Data folder created successfully.');
  } catch (error) {
    console.error('Error creating data folder:', error);
  }
}

async function fetchCsvData(url) {
  const response = await fetch(url);
  return response.text();
}

async function processCsvData(csvContent, outputFileName) {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(csvContent)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await fs.writeFile(path.join(dataDir, outputFileName), JSON.stringify(results, null, 2));
          console.log(`${outputFileName} created successfully.`);
          resolve();
        } catch (error) {
          console.error(`Error creating ${outputFileName}:`, error);
          reject(error);
        }
      });
  });
}

async function main() {
  await createDataFolder();

  for (const [key, url] of Object.entries(csvUrls)) {
    const csvContent = await fetchCsvData(url);
    await processCsvData(csvContent, `${key}.json`);
  }

  console.log('Sample data creation completed.');
}

main().catch(console.error);