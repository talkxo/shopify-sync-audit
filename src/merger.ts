import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { Product, Variant } from './validator';

export async function mergeData(csvFilePath: string, imagesDirPath: string): Promise<any[]> {
  const productsMap = new Map<string, any>();

  let imageFiles: string[] = [];
  if (fs.existsSync(imagesDirPath)) {
    imageFiles = fs.readdirSync(imagesDirPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  }

  let rowCount = 1; // Start at 1 for the header row

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rowCount++; // Increment for each data row
        const handle = row.Handle || row.handle;
        if (!handle) return; 

        const productImages = imageFiles
          .filter(img => img.startsWith(handle))
          .map(img => path.join(imagesDirPath, img));

        const variant = {
          sku: row.SKU || row.sku || '',
          size: row.Size || row.size || '',
          price: parseFloat(row.Price || row.price || '0'),
          inventoryQuantity: parseInt(row.Inventory || row.inventory || '0', 10),
        };

        if (productsMap.has(handle)) {
          productsMap.get(handle)!.variants.push(variant);
        } else {
          productsMap.set(handle, {
            _csvRow: rowCount, // HIDDEN FIELD: Track the exact excel row!
            handle: handle,
            title: row.Title || row.title || '',
            description: row.Description || row.description || '',
            images: productImages,
            variants: [variant],
          });
        }
      })
      .on('end', () => resolve(Array.from(productsMap.values())))
      .on('error', reject);
  });
}
