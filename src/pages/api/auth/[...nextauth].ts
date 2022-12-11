import NextAuth, { type NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AxiosRequestConfig } from "axios";

import api from "@/utils/api";
import {
    AuthError,
    UserSchema,
    validateEmailFormat,
    validatePasswordFormat,
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

                const { email, password } = credentials;

                const validFormatEmail = validateEmailFormat(email);
                const validFormatPassword = validatePasswordFormat(password);

                const response = await fetchSignInAPI({
                    email: validFormatEmail,
                    password: validFormatPassword,
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
        throw new Error(AuthError.INVALID_EMAIL_OR_PASSWORD);
    }

    return {
        success,
        user,
    };
};
