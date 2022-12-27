import { z } from "zod";

import api from "@/utils/api";
import type { County } from "@/utils/county";

const DistrictSchema = z.object({
    id: z.number().nonnegative(),
    countyId: z.number().nonnegative(),
    name: z.string().min(1),
});

type District = z.infer<typeof DistrictSchema>;

const DistrictsSchema = z.array(DistrictSchema);

export type Districts = z.infer<typeof DistrictsSchema>;

export const fetchDistrictsAPI = async () => {
    const { data } = await api.get("/districts");

    const parsedDistricts = DistrictsSchema.safeParse(data);

    if (parsedDistricts.success) {
        return parsedDistricts.data;
    }

    throw new Error(parsedDistricts.error.message);
};

export type DistrictIdMap = Map<string, number>;

export const getDistrictIdMap = (districts: District[]) => {
    const districtIdMap: DistrictIdMap = new Map();

    districts.forEach(({ id, countyId, name }) => {
        districtIdMap.set(`${countyId}${name}`, id);
    });

    return districtIdMap;
};

export type DistrictMap = Map<string, string[]>;

export const getDistrictMap = (counties: County[], districts: District[]) => {
    const districtData: DistrictMap = new Map();

    for (const district of districts) {
        const county = counties[district.countyId];

        if (!county) {
            break;
        }

        const districtsOfCounty = districtData.get(county.name);

        if (!districtsOfCounty) {
            districtData.set(county.name, ["請選擇行政區", district.name]);
        } else {
            districtsOfCounty.push(district.name);
        }
    }

    return districtData;
};
