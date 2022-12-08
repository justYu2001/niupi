import NextAuth, { type NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AxiosRequestConfig } from "axios";

import api from "@/utils/api";
import decrypt from "@/utils/decrypt";
import {
    EmailSchema,
    PasswordSchema,
    UserSchema,
    SignInError,
} from "@/utils/auth";

export const authOptions: NextAuthOptions = {
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.name = user.username;
            }

            return token;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                session.user.name = token.name;
                session.user.image = null;
            }

            return session;
        },
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                const parsedEmail = EmailSchema.safeParse(credentials.email);

                if (!parsedEmail.success) {
                    throw new Error(SignInError.ERROR_EMAIL_FORMAT);
                }

                const decryptedPassword = decrypt(credentials.password);
                const parsedPassword =
                    PasswordSchema.safeParse(decryptedPassword);

                if (!parsedPassword.success) {
                    throw new Error(SignInError.ERROR_PASSWORD_FORMAT);
                }

                const response = await fetchSignInAPI({
                    email: parsedEmail.data,
                    password: parsedPassword.data,
                });

                if (response.success) {
                    return response.user;
                } else {
                    return null;
                }
            },
        }),
        // ...add more providers here
    ],
    pages: {
        signIn: "/signin",
    },
};

export default NextAuth(authOptions);

interface SignInAPIRequestBody {
    email: string;
    password: string;
}

type SignInAPIResponseData = User | null;

type SignInAPIResponse = {
    success: boolean;
    user: SignInAPIResponseData;
};

interface FetchSignInAPIFunction {
    (data: SignInAPIRequestBody): Promise<SignInAPIResponse>;
}

const fetchSignInAPI: FetchSignInAPIFunction = async (data) => {
    /*
     * Using the validateStatus config option, we can define HTTP code(s) that should not throw an error.
     * Documentation Link: https://axios-http.com/docs/handling_errors
     *
     * Since we need to handle 4XX errors ourselves, for the client-side error message.
     * We set validStatus to ensure that status codes under 500 will not be Promise.reject() by Axios,
     * so that we can throw the custom error message.
     */

    const config: AxiosRequestConfig<SignInAPIRequestBody> = {
        data,
        validateStatus(status) {
            return status < 500;
        },
    };

    const response = await api.get("auth/login", config);
    const parsedUser = UserSchema.safeParse(response.data);

    let success = false;
    let user: SignInAPIResponseData = null;

    if (response.status === 200 && parsedUser.success) {
        success = true;
        user = parsedUser.data;
    } else if (response.status === 400) {
        throw new Error(SignInError.INVALID_EMAIL_OR_PASSWORD);
    }

    return {
        success,
        user,
    };
};
