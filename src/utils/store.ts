import { z } from "zod";

import { CellphoneNumberSchema, TelephoneNumberSchema, UUIDSchema } from "@/utils/validator";

const AddressSchema = z.object({
    county: z.string(),
    district: z.string(),
    detail: z.string(),
});

const StoreSchema = z.object({
    id: UUIDSchema,
    sellerId: UUIDSchema,
    name: z.string().trim().min(1).nullable(),
    address: AddressSchema,
    email: z.string().email().nullable(),
    cellphoneNumber: CellphoneNumberSchema,
    telephoneNumber: TelephoneNumberSchema,
});

export type Store = z.infer<typeof StoreSchema>;