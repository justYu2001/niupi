import {
    ChangeEvent,
    FocusEvent,
    useEffect,
    useState,
    useRef,
    FormEvent,
} from "react";
import { NextPageWithLayout, GetStaticProps } from "next";
import axios, { AxiosResponse } from "axios";
import { IoIosArrowDown } from "react-icons/io";
import {
    useQuery,
    useMutation,
    UseMutateFunction,
} from "@tanstack/react-query";

import Input from "@/components/Seller/Input";
import { useStoreId } from "@/hooks/store";
import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import type { StoreUpdate } from "@/pages/api/stores/[storeId]";
import {
    type Counties,
    fetchCountiesAPI,
    getCountyIdMap,
} from "@/utils/county";
import {
    type Districts,
    fetchDistrictsAPI,
    getDistrictIdMap,
    getDistrictMap,
} from "@/utils/district";
import type { Store } from "@/utils/store";

const fetchStoreProfileAPI = async (storeId: string) => {
    const url = `/api/stores/${storeId}`;
    const { data: store } = await axios.get<Store>(url);

    return store;
};

interface StoreUpdatePayload {
    storeId: string;
    requestBody: StoreUpdate;
}

const updateStore = ({ storeId, requestBody }: StoreUpdatePayload) => {
    const url = `/api/stores/${storeId}`;
    return axios.patch(url, requestBody);
};

type SubmitHandlerCallback = UseMutateFunction<
    AxiosResponse,
    unknown,
    StoreUpdatePayload,
    unknown
>;

interface StoreProfileFormData {
    name: { value: string };
    county: { value: string };
    district: { value: string };
    detailAddress: { value: string };
    email: { value: string };
    cellphoneNumber: { value: string };
    telephoneNumber: { value: string };
}

const handleFormSubmit = (
    storeId: string,
    counties: Counties,
    districts: Districts,
    callback: SubmitHandlerCallback
) => {
    return (event: FormEvent) => {
        event.preventDefault();

        const {
            name,
            county,
            district,
            detailAddress,
            email,
            cellphoneNumber,
            telephoneNumber,
        } = event.target as typeof event.target & StoreProfileFormData;

        const countyIdMap = getCountyIdMap(counties);
        const countyId = countyIdMap.get(county.value) ?? null;

        const districtIdMap = getDistrictIdMap(districts);
        const districtId =
            districtIdMap.get(`${countyId}${district.value}`) ?? null;

        callback({
            storeId,
            requestBody: {
                name: name.value,
                countyId,
                districtId,
                detailAddress: detailAddress.value,
                email: email.value,
                cellphoneNumber: cellphoneNumber.value,
                telephoneNumber: telephoneNumber.value,
            },
        });
    };
};

interface StoreProfilePageProps {
    counties: Counties;
    districts: Districts;
    countyNames: string[];
}

const StoreProfile: NextPageWithLayout<StoreProfilePageProps> = ({
    counties,
    districts,
    countyNames,
}) => {
    const districtMapRef = useRef(getDistrictMap(counties, districts));

    const { storeId } = useStoreId();

    const { data: store, isLoading } = useQuery({
        queryKey: ["store", storeId],
        queryFn: () => fetchStoreProfileAPI(storeId as string),
        onSuccess: (data) => setCounty(data.address.county),
        enabled: !!storeId,
    });

    const [county, setCounty] = useState("請選擇縣市");
    const [countyChanged, setCountyChanged] = useState(false);

    const handleCountyListBoxChange = (county: string) => {
        setCounty(county);
        setCountyChanged(true);
    };

    const { mutate, isLoading: isUpdating } = useMutation(updateStore);

    if (isLoading || !storeId) {
        return (
            <div className="flex flex-1 justify-center">
                <div className="my-4 flex w-4/5 items-center justify-center rounded bg-white">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-indian-yellow border-t-white"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 justify-center">
            <div className="my-4 flex w-4/5 flex-col rounded bg-white py-6 px-10">
                <h2 className="text-2xl font-medium tracking-wide">賣場資訊</h2>
                <form
                    action="/api"
                    method="patch"
                    className="relative flex-1"
                    onSubmit={handleFormSubmit(
                        storeId,
                        counties,
                        districts,
                        mutate
                    )}
                >
                    <div className="mt-10 flex">
                        <Input
                            id="f1"
                            fieldName="商店名稱"
                            name="name"
                            defaultValue={store?.name}
                            className="mr-8 flex-1"
                        />
                        <Input
                            id="f2"
                            fieldName="電子郵件"
                            name="email"
                            defaultValue={store?.email}
                            className="flex-1"
                        />
                    </div>
                    <div className="my-10 flex justify-between">
                        <div className="mr-8 flex flex-1">
                            <ListBox
                                id="f3"
                                fieldName="縣市"
                                name="county"
                                value={store?.address.county}
                                defaultValue="請選擇縣市"
                                options={countyNames}
                                className="mr-8 flex-1"
                                onChange={handleCountyListBoxChange}
                            />
                            <ListBox
                                id="f4"
                                className="flex-1"
                                fieldName="行政區"
                                name="district"
                                defaultValue="請選擇行政區"
                                value={store?.address.district}
                                options={districtMapRef.current.get(county)}
                                isAllowedToResetOptions={countyChanged}
                            />
                        </div>
                        <Input
                            id="f5"
                            fieldName="詳細地址"
                            name="detailAddress"
                            defaultValue={store?.address.detail}
                            className="flex-1"
                        />
                    </div>
                    <div className="my-10 flex">
                        <Input
                            id="f6"
                            fieldName="電話號碼"
                            name="telephoneNumber"
                            defaultValue={store?.telephoneNumber}
                            className="mr-8 flex-1"
                        />
                        <Input
                            id="f7"
                            fieldName="手機號碼"
                            name="cellphoneNumber"
                            defaultValue={store?.cellphoneNumber}
                            className="flex-1"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="absolute bottom-0 right-0 rounded bg-indian-yellow py-1 px-4 font-medium tracking-wide text-white disabled:bg-indian-yellow/50"
                    >
                        儲存
                    </button>
                </form>
            </div>
        </div>
    );
};

StoreProfile.getLayout = getSellerDashboardLayout;

export default StoreProfile;

export const getStaticProps: GetStaticProps = async () => {
    const [counties, districts] = await Promise.all([
        fetchCountiesAPI(),
        fetchDistrictsAPI(),
    ]);

    const countyNames = ["請選擇縣市", ...counties.map(({ name }) => name)];

    return {
        props: {
            countyNames,
            counties,
            districts,
        },
    };
};

interface ListBoxProps {
    id: string;
    className?: string;
    fieldName: string;
    name: string;
    defaultValue: string;
    value: string | null | undefined;
    options?: string[];
    isAllowedToResetOptions?: boolean;
    onChange?: (value: string) => void;
}

function ListBox({
    id,
    className = "",
    fieldName,
    name,
    defaultValue,
    value,
    options = [defaultValue],
    isAllowedToResetOptions = false,
    onChange = () => undefined,
}: ListBoxProps) {
    const optionsRef = useRef(options);

    const [isOpen, setIsOpen] = useState(false);

    const openListBox = (event: FocusEvent<HTMLInputElement>) => {
        const inputElement = event.target;
        inputElement.selectionStart = inputElement.value.length;
        setIsOpen(true);
    };

    const closeListBox = () => setIsOpen(false);

    const [inputValue, setInputValue] = useState(optionsRef.current[0]);

    useEffect(() => {
        if (options !== optionsRef.current) {
            optionsRef.current = options;
            isAllowedToResetOptions && setInputValue(optionsRef.current[0]);
        }
    }, [options, isAllowedToResetOptions]);

    useEffect(() => {
        if (typeof value === "string") {
            setInputValue(value);
        }
    }, [value]);

    const handleOptionClick = (option: string) => {
        return () => {
            setInputValue(option);
            onChange(option);
        };
    };

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const regex = new RegExp(`^.*${event.target.value}.*$`);

        optionsRef.current = options.filter((option) => {
            return regex.test(option);
        });

        setInputValue(event.target.value);
    };

    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="my-1 block font-medium tracking-wide text-slate-400"
            >
                {fieldName}
            </label>
            <div className="relative">
                <label className="flex items-center rounded border-2 border-slate-300 px-2 focus-within:border-indian-yellow">
                    <input
                        type="text"
                        value={inputValue}
                        id={id}
                        name={name}
                        autoComplete="do-not-autofill"
                        className="flex-1 py-2 outline-none"
                        onFocus={openListBox}
                        onBlur={closeListBox}
                        onChange={handleInput}
                    />
                    <IoIosArrowDown className="text-slate-400" />
                </label>
                <ul
                    className={`${
                        isOpen ? "list-item" : "hidden"
                    } absolute inset-x-0 top-12 max-h-[200px] cursor-pointer overflow-y-scroll rounded shadow-lg`}
                >
                    {optionsRef.current.map((option) => (
                        <li
                            key={option}
                            className="bg-white p-2 hover:bg-slate-200"
                            onMouseDown={handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
