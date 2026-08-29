import { z } from 'zod';
export declare const VariantSchema: z.ZodObject<{
    sku: z.ZodString;
    size: z.ZodEnum<{
        L: "L";
        M: "M";
        OS: "OS";
        S: "S";
        XL: "XL";
        XS: "XS";
        XXL: "XXL";
    }>;
    price: z.ZodNumber;
    inventoryQuantity: z.ZodNumber;
}, z.core.$strip>;
export declare const ProductSchema: z.ZodObject<{
    handle: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    images: z.ZodArray<z.ZodString>;
    variants: z.ZodArray<z.ZodObject<{
        sku: z.ZodString;
        size: z.ZodEnum<{
            L: "L";
            M: "M";
            OS: "OS";
            S: "S";
            XL: "XL";
            XS: "XS";
            XXL: "XXL";
        }>;
        price: z.ZodNumber;
        inventoryQuantity: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Product = z.infer<typeof ProductSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export declare function validateProduct(data: unknown): Product;
//# sourceMappingURL=validator.d.ts.map