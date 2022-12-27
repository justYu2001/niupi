import { type NextApiHandler } from "next";
import { AxiosError } from "axios";
import { z } from "zod";

import api from "@/utils/api";
import APIRouter from "@/utils/api-router";
import { env } from "@/env/server.mjs";
import {
    CellphoneNumberSchema,
    TelephoneNumberSchema,
    validateUUID,
} from "@/utils/validator";

const getStoreProfile: NextApiHandler = async (request, response) => {
    const { storeId } = request.query;

    if (!storeId) {
        return response.status(404);
    }

    try {
        const validStoreId = validateUUID(storeId, "Store Not Found");

        const { data, status } = await api.get(
            `${env.API_URL}/stores/${validStoreId}`
        );

        return response.status(status).json(data);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;
            return response.status(status).send(data.detail);
        } else if (error instanceof Error) {
            return response.status(404).send(error.message);
        }
    }
};

const StoreUpdateSchema = z.object({
    name: z.string().trim().min(1),
    email: z.string().email().nullable(),
    countyId: z.number().nonnegative().nullable(),
    districtId: z.number().nonnegative().nullable(),
    detailAddress: z.string().trim().min(1).nullable(),
    cellphoneNumber: CellphoneNumberSchema.nullable(),
    telephoneNumber: TelephoneNumberSchema.nullable(),
});

export type StoreUpdate = z.infer<typeof StoreUpdateSchema>;

const updateStoreProfile: NextApiHandler = async (request, response) => {
    const { storeId } = request.query;

    if (!storeId) {
        return response.status(404);
    }

    try {
        const validStoreId = validateUUID(storeId, "Store Not Found");
        const url = `${env.API_URL}/stores/${validStoreId}`;

        const parsedRequestBody = StoreUpdateSchema.safeParse(request.body);

        if (parsedRequestBody.success) {
            const { data, status } = await api.patch(
                url,
                parsedRequestBody.data
            );

            return response.status(status).json(data);
        } else {
            return response.status(422).send(parsedRequestBody.error);
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;
            return response.status(status).send(data.detail);
        } else if (error instanceof Error) {
            return response.status(404).send(error.message);
        }
    }
};

export default APIRouter({
    GET: getStoreProfile,
    PATCH: updateStoreProfile,
});
