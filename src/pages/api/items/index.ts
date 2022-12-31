import { type NextApiHandler } from "next";
import { AxiosError } from "axios";
import { z } from "zod";

import api from "@/utils/api";
import APIRouter from "@/utils/api-router";
import { UUIDSchema } from "@/utils/validator";

const NewItemSchema = z.object({
    storeId: UUIDSchema,
    name: z.string().trim().min(1),
    description: z.string(),
    price: z.number(),
    inventory: z.number(),
    photoIds: z.array(UUIDSchema),
});

export type NewItem = z.infer<typeof NewItemSchema>;

const addItem: NextApiHandler = async (request, response) => {
    try {
        const parsedRequestBody = NewItemSchema.safeParse(request.body);

        if (parsedRequestBody.success) {
            const { data, status } = await api.post<NewItem>("/items",parsedRequestBody.data);
            return response.status(status).send(data);
        }

        return response.status(422).send(parsedRequestBody.error);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const { status, data } = error.response;
            return response.status(status).send(data.detail);
        } else if (error instanceof Error) {
            return response.status(422).send(error.message);
        }
    }
};

export default APIRouter({
    POST: addItem,
});
