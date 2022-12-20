import { ChangeEvent, FocusEvent, useEffect, useState, useRef } from "react";
import { NextPageWithLayout } from "next";
import { IoIosArrowDown } from "react-icons/io";

import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { type County, districts } from "@/utils/districts";

const counties = Object.keys(districts);

const StoreProfile: NextPageWithLayout = () => {
    const [county, setCounty] = useState<County>("選擇縣市");

    return (
        <div className="flex flex-1 justify-center">
            <div className="my-4 flex w-4/5 flex-col rounded bg-white py-6 px-10">
                <h2 className="text-2xl font-medium tracking-wide">賣場資訊</h2>
                <form action="" method="patch" className="relative flex-1">
                    <div className="mt-10 flex">
                        <Input
                            id="f1"
                            fieldName="商店名稱"
                            className="mr-8 flex-1"
                        />
                        <Input
                            id="f2"
                            fieldName="電子郵件"
                            className="flex-1"
                        />
                    </div>
                    <div className="my-10 flex justify-between">
                        <ListBox
                            id="f3"
                            fieldName="縣市"
                            className="mr-8"
                            options={counties}
                            onChange={(county) => setCounty(county as County)}
                        />
                        <ListBox
                            id="f4"
                            className="mr-8"
                            fieldName="行政區"
                            options={["選擇行政區", ...districts[county]]}
                        />
                        <Input
                            id="f5"
                            fieldName="詳細地址"
                            className="flex-1"
                        />
                    </div>
                    <div className="my-10 flex">
                        <Input
                            id="f6"
                            fieldName="電話號碼"
                            className="mr-8 flex-1"
                        />
                        <Input
                            id="f7"
                            fieldName="手機號碼"
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

interface InputProps {
    fieldName: string;
    id: string;
    className?: string;
}

function Input({ fieldName, id, className = "" }: InputProps) {
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
    options: string[];
    onChange?: (value: string) => void;
}

function ListBox({
    id,
    className = "",
    fieldName,
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

    const [inputValue, setInputValue] = useState(optionsRef.current[0]);

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
