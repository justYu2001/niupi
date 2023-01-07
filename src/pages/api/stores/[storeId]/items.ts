import { type NextApiHandler } from "next";

import { z } from "zod";

import api from "@/utils/api";
import APIRouter from "@/utils/api-router";

const fetchItems = (storeId: string, keyword: string) => {
    const url = `/stores/${storeId}/items?keyword=${keyword}`;
    return api.get(url);
};

const ItemSearchQuerySchema = z.object({
    storeId: z.string(),
    keyword: z.string(),
});

const searchItems: NextApiHandler = async (request, response) => {
    const parsedRequestQuery = ItemSearchQuerySchema.safeParse(request.query);

    if (!parsedRequestQuery.success) {
        return response.status(404);
    }

    const { storeId, keyword } = parsedRequestQuery.data;

    const { data, status } = await fetchItems(storeId, keyword);

    return response.status(status).send(data);
};

export default APIRouter({
    GET: searchItems,
});
