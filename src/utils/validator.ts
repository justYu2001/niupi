import { z } from "zod";

const cellphoneNumberRegex = new RegExp("^09+([0-9]{8})$|^$");
export const CellphoneNumberSchema = z.string().regex(cellphoneNumberRegex);

const telephoneNumberRegex = new RegExp(
    "^(?=([0-9]{2,4}-[0-9]{6,8})).{10,11}$|^$"
);

export const TelephoneNumberSchema = z.string().regex(telephoneNumberRegex);

export const UUIDSchema = z.string().uuid();

export const validateUUID = (
    value: unknown,
    errorMessage = "Invalid UUID Format"
) => {
    const parsedUUID = UUIDSchema.safeParse(value);

    if (parsedUUID.success) {
        return parsedUUID.data;
    }

    throw new Error(errorMessage);
};
