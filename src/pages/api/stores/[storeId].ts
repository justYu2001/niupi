import { NextApiRequest, type NextApiResponse } from "next";
import { AxiosError } from "axios";

import { env } from "@/env/server.mjs";
import api from "@/utils/api";
import { validateUUID } from "@/utils/validator";

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method !== "GET") {
        response.status(405);
    }

    const { storeId } = request.query;

    if (storeId === undefined) {
        response.status(404);
    }

    try {
        const validStoreId = validateUUID(storeId, "Store Not Found");

        const { data, status } = await api.get(`${env.API_URL}/stores/${validStoreId}`);

        response.status(status).json(data);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;
            response.status(status).send(data.detail);
        } else if (error instanceof Error) {
            response.status(404).send(error.message);
        }
    }
}
