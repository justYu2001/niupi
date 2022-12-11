import { z } from "zod";

import decrypt from "@/utils/decrypt";

export const EmailSchema = z.string().email();

export const validateEmailFormat = (email: string) => {
    const parsedEmail = EmailSchema.safeParse(email);

    if (parsedEmail.success) {
        return parsedEmail.data;
    } else {
        throw new Error(AuthError.INVALID_EMAIL_FORMAT);
    }
};

export const UsernameSchema = z.string().min(1).trim();

export const validateUsernameFormat = (username: string) => {
    const parsedUsername = UsernameSchema.safeParse(username);

    if (parsedUsername.success) {
        return parsedUsername.data;
    } else {
        throw new Error(AuthError.INVALID_USERNAME_FORMAT);
    }
};

export const PasswordSchema = z.string().min(1);

export const validatePasswordFormat = (encryptedPassword: string) => {
    const decryptedPassword = decrypt(encryptedPassword);
    const parsedPassword = PasswordSchema.safeParse(decryptedPassword);

    if (parsedPassword.success) {
        return parsedPassword.data;
    } else {
        throw new Error(AuthError.INVALID_PASSWORD_FORMAT);
    }
};

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string(),
    address: z.string().nullable(),
    cellphoneNumber: z.string().nullable(),
    roleId: z.number().nonnegative().lte(1),
});

export type User = z.infer<typeof UserSchema>;

export interface SignUpAPIRequestBody {
    email: string;
    username: string;
    password: string;
}

export enum AuthError {
    EMAIL_EXISTS = "電子郵件已被註冊",
    INVALID_EMAIL_OR_PASSWORD = "電子郵件或密碼錯誤",
    INVALID_EMAIL_FORMAT = "請輸入正確的電子郵件格式",
    INVALID_PASSWORD_FORMAT = "密碼欄位不能為空",
    INVALID_USERNAME_FORMAT = "使用者名稱欄位不能為空",
}
