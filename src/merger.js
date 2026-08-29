"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeData = mergeData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const validator_1 = require("./validator");
async function mergeData(csvFilePath, imagesDirPath) {
    const productsMap = new Map();
    let imageFiles = [];
    if (fs_1.default.existsSync(imagesDirPath)) {
        imageFiles = fs_1.default.readdirSync(imagesDirPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    }
    let rowCount = 1; // Start at 1 for the header row
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(csvFilePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            rowCount++; // Increment for each data row
            const handle = row.Handle || row.handle;
            if (!handle)
                return;
            const productImages = imageFiles
                .filter(img => img.startsWith(handle))
                .map(img => path_1.default.join(imagesDirPath, img));
            const variant = {
                sku: row.SKU || row.sku || '',
                size: row.Size || row.size || '',
                price: parseFloat(row.Price || row.price || '0'),
                inventoryQuantity: parseInt(row.Inventory || row.inventory || '0', 10),
            };
            if (productsMap.has(handle)) {
                productsMap.get(handle).variants.push(variant);
            }
            else {
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
//# sourceMappingURL=merger.js.map