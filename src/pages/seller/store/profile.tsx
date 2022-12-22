import { ChangeEvent, FocusEvent, useEffect, useState, useRef } from "react";
import { NextPageWithLayout, GetStaticProps } from "next";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";

import { env } from "@/env/server.mjs";
import { useStoreId } from "@/hooks/store";
import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import type { County, Districts } from "@/utils/districts";
import { type Store } from "@/utils/store";

const fetchStoreProfileAPI = async (storeId: string) => {
    const url = `/api/stores/${storeId}`;
    const { data: store } = await axios.get<Store>(url);

    return store;
};

interface StoreProfilePageProps {
    counties: County[];
    districts: Districts;
}

const StoreProfile: NextPageWithLayout<StoreProfilePageProps> = ({
    counties,
    districts,
}) => {
    const [county, setCounty] = useState<County>("選擇縣市");

    const { storeId } = useStoreId();

    const { data: store, isLoading } = useQuery({
            queryKey: ["store", storeId],
            queryFn: () => fetchStoreProfileAPI(storeId as string),
            enabled: !!storeId,
        }
    );

    if (isLoading) {
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
                <form action="" method="patch" className="relative flex-1">
                    <div className="mt-10 flex">
                        <Input
                            id="f1"
                            fieldName="商店名稱"
                            defaultValue={store?.name}
                            className="mr-8 flex-1"
                        />
                        <Input
                            id="f2"
                            fieldName="電子郵件"
                            defaultValue={store?.email}
                            className="flex-1"
                        />
                    </div>
                    <div className="my-10 flex justify-between">
                        <ListBox
                            id="f3"
                            fieldName="縣市"
                            defaultValue={store?.address.county}
                            options={counties}
                            className="mr-8"
                            onChange={(county) => setCounty(county as County)}
                        />
                        <ListBox
                            id="f4"
                            className="mr-8"
                            fieldName="行政區"
                            defaultValue={store?.address.district}
                            options={["選擇行政區", ...districts[county]]}
                        />
                        <Input
                            id="f5"
                            fieldName="詳細地址"
                            defaultValue={store?.address.detail}
                            className="flex-1"
                        />
                    </div>
                    <div className="my-10 flex">
                        <Input
                            id="f6"
                            fieldName="電話號碼"
                            defaultValue={store?.telephoneNumber}
                            className="mr-8 flex-1"
                        />
                        <Input
                            id="f7"
                            fieldName="手機號碼"
                            defaultValue={store?.cellphoneNumber}
                            className="flex-1"
                        />
                    </div>
                    <button
                        type="submit"
                        className="absolute bottom-0 right-0 rounded bg-indian-yellow py-1 px-4 font-medium tracking-wide text-white"
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
    const response = await axios.get(`${env.API_URL}/districts`);
    let districts = {};
    let counties: string[] = [];

    if (response.status === 200) {
        districts = { 選擇縣市: [], ...response.data };
        counties = Object.keys(districts);
    }

    return {
        props: {
            counties,
            districts,
        },
    };
};

interface InputProps {
    fieldName: string;
    id: string;
    className?: string;
    defaultValue: string | null | undefined;
}

function Input({ fieldName, id, defaultValue, className = "" }: InputProps) {
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="my-1 block font-medium tracking-wide text-slate-400"
            >
                {fieldName}
            </label>
            <input
                type="text"
                defaultValue={defaultValue ?? ""}
                id={id}
                autoComplete="do-not-autofill"
                className="block w-full rounded border-2 border-slate-300 p-2 outline-none transition-all duration-300 focus:border-indian-yellow"
            />
        </div>
    );
}

interface ListBoxProps {
    id: string;
    className?: string;
    fieldName: string;
    defaultValue: string | null | undefined;
    options: string[];
    onChange?: (value: string) => void;
}

function ListBox({
    id,
    className = "",
    fieldName,
    defaultValue,
    options,
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

    const [inputValue, setInputValue] = useState(
        defaultValue ?? optionsRef.current[0]
    );

    const handleOptionClick = (option: string) => {
        return () => {
            setInputValue(option);
            onChange(option);
        };
    };

    useEffect(() => {
        if (options != optionsRef.current) {
            optionsRef.current = options;
            setInputValue(optionsRef.current[0]);
        }
    }, [options]);

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
                        autoComplete="do-not-autofill"
                        className="py-2 outline-none"
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
