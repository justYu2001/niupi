import { ChangeEvent, useState } from "react";

import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";

import { useStoreId } from "@/hooks/store";
import { Item } from "@/utils/item";

const searchItems = (storeId: string | undefined, keyword: string) => {
    if (storeId) {
        const url = `/api/stores/${storeId}/items${keyword === "" ? "" : `?keyword=${keyword}`}`;

        console.log(url);
        
        
        return async () => {
            const { data } = await axios.get<Item[]>(url);
            return data;
        };
    }

    return () => [];
};

interface SearchBarProps {
    onSearch: (items: Item[]) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
    const { storeId } = useStoreId();

    const [keyword, setKeyword] = useState("%");

    const handleSearchBarInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const inputElement = event.target;
        const keyword = inputElement.value;
        setKeyword(keyword);
    };

    useQuery(["items", storeId, keyword], {
        queryFn: searchItems(storeId, keyword),
        enabled: !!storeId,
        onSuccess: (data) => onSearch(data),
    });

    return (
        <div className="my-8 flex items-center rounded border-2 border-slate-300 outline-none transition-all duration-300 focus-within:border-indian-yellow">
            <input
                type="text"
                placeholder="輸入關鍵字以搜尋商品"
                className="peer flex-1 p-2 outline-none"
                onChange={handleSearchBarInputChange}
            />
            <AiOutlineSearch className="mr-2 text-2xl text-slate-300" />
        </div>
    );
}

export default SearchBar;
