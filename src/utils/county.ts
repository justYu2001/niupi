import { z } from "zod";
import api from "@/utils/api";

const CountySchema = z.object({
    name: z.string().min(1),
    id: z.number().nonnegative(),
});

export type County = z.infer<typeof CountySchema>;

const CountiesSchema = z.array(CountySchema);

export type Counties = z.infer<typeof CountiesSchema>;

export const fetchCountiesAPI = async () => {
    const { data } = await api.get("/counties");

    const parsedCounties = CountiesSchema.safeParse(data);

    if (parsedCounties.success) {
        return parsedCounties.data;
    }

    throw new Error("error");
};

export type CountyIdMap = Map<string, number>;

export const getCountyIdMap = (counties: County[]) => {
    const countyIdMap: CountyIdMap = new Map();

    counties.forEach(({ name, id }) => {
        countyIdMap.set(name, id);
    });

    return countyIdMap;
};
