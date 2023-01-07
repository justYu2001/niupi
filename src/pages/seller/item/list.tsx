import { useState } from "react";
import { NextPageWithLayout } from "next";

import ItemTable from "@/components/Seller/ItemTable";
import SearchBar from "@/components/Seller/SearchBar";
import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { Item } from "@/utils/item";

const ItemList: NextPageWithLayout = () => {
    const [items, setItems] = useState<Item[]>([]);

    return (
        <div className="flex flex-1 justify-center">
            <div className="my-4 flex w-4/5 flex-col rounded bg-white p-6">
                <h2 className="text-lg font-medium tracking-wide">我的商品</h2>

                <SearchBar onSearch={(items) => setItems(items)} />

                <ItemTable itemsProp={items} />
            </div>
        </div>
    );
};

ItemList.getLayout = getSellerDashboardLayout;

export default ItemList;
