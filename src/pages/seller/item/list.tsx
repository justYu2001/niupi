import { NextPageWithLayout } from "next";

import ItemTable from "@/components/Seller/ItemTable";
import SearchBar from "@/components/Seller/SearchBar";
import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";

const ItemList: NextPageWithLayout = () => {
    return (
        <div className="flex flex-1 justify-center">
            <div className="my-4 w-4/5 rounded bg-white p-6">
                <h2 className="text-lg font-medium tracking-wide">我的商品</h2>

                <SearchBar />

                <ItemTable />
            </div>
        </div>
    );
};

ItemList.getLayout = getSellerDashboardLayout;

export default ItemList;
