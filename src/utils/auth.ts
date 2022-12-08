import { z } from "zod";

export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(1);

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string(),
    address: z.string().nullable(),
    cellphoneNumber: z.string().nullable(),
    roleId: z.number().nonnegative().lte(1),
});

export enum SignInError {
    EMAIL_EXISTS = "Email already in use.",
    INVALID_EMAIL_OR_PASSWORD = "Email 或密碼錯誤",
    ERROR_EMAIL_FORMAT = "請輸入正確的 Email 格式",
    ERROR_PASSWORD_FORMAT = "密碼欄位不能為空",
}
