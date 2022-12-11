import { NextApiRequest, NextApiResponse } from "next";
import { AxiosError, AxiosResponse } from "axios";

import api from "@/utils/api";
import {
    AuthError,
    SignUpAPIRequestBody,
    validateEmailFormat,
    validatePasswordFormat,
    validateUsernameFormat,
    UserSchema,
    type User,
} from "@/utils/auth";

interface SignUpAPIRequest extends NextApiRequest {
    body: SignUpAPIRequestBody;
}

type SignUpAPIResponse = AxiosResponse<User>;

const fetchSignUpAPI = async (requestBody: SignUpAPIRequestBody) => {
    const response = await api.post<SignUpAPIRequestBody, SignUpAPIResponse>(
        "auth/signup",
        requestBody
    );

    const parsedUser = UserSchema.safeParse(response.data);

    if (response.status === 200 && parsedUser.success) {
        response.data = parsedUser.data;
    }

    return response;
};

export default async function handler(
    request: SignUpAPIRequest,
    response: NextApiResponse
) {
    if (request.method !== "POST") {
        response.status(405);
    }

    const { email, username, password } = request.body;

    try {
        const validFormatEmail = validateEmailFormat(email);
        const validFormatUsername = validateUsernameFormat(username);
        const validFormatPassword = validatePasswordFormat(password);

        const { data, status } = await fetchSignUpAPI({
            email: validFormatEmail,
            username: validFormatUsername,
            password: validFormatPassword,
        });

        response.status(status).json(data);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400) {
            response.status(400).send(AuthError.EMAIL_EXISTS);
        } else if (error instanceof Error) {
            response.status(422).send(error.message);
        }
    }
}
