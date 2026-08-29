"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.VariantSchema = void 0;
exports.validateProduct = validateProduct;
const zod_1 = require("zod");
const AllowedSizes = zod_1.z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS']);
exports.VariantSchema = zod_1.z.object({
    sku: zod_1.z.string().min(4, "Inventory: SKU must be at least 4 characters long for proper tracking"),
    size: AllowedSizes,
    price: zod_1.z.number().positive("Pricing: Price must be greater than $0.00"),
    inventoryQuantity: zod_1.z.number().int().nonnegative("Inventory: Cannot have negative stock"),
});
exports.ProductSchema = zod_1.z.object({
    handle: zod_1.z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "SEO: Product handle must be URL-safe (lowercase, numbers, and hyphens only)"),
    title: zod_1.z.string()
        .min(20, "SEO: Title is too short. Best practice is 20-70 characters.")
        .max(70, "SEO: Title is too long. Will be truncated in search engines."),
    description: zod_1.z.string()
        .min(150, "Content: Description is too short (minimum 150 chars for SEO).")
        .refine((text) => {
        const lower = text.toLowerCase();
        let matches = 0;
        if (lower.includes('material') || lower.includes('fabric'))
            matches++;
        if (lower.includes('care') || lower.includes('wash'))
            matches++;
        if (lower.includes('fit') || lower.includes('size guide'))
            matches++;
        return matches >= 2;
    }, { message: "Content: Description must include at least two standard sections: 'Materials/Fabric', 'Care Instructions', or 'Fit/Size Guide'." }),
    images: zod_1.z.array(zod_1.z.string()).min(4, "Conversion: 2026 standards require at least 4 images per product (e.g., Front, Back, Detail, Lifestyle)."),
    variants: zod_1.z.array(exports.VariantSchema).min(1, "Inventory: At least one variant is required."),
});
function validateProduct(data) {
    return exports.ProductSchema.parse(data);
}
//# sourceMappingURL=validator.js.map