import { NextPageWithLayout } from "next";

import Input from "@/components/Seller/Input";
import PhotoUploader from "@/components/Seller/PhotoUploader";
import RichText from "@/components/Seller/RichText";
import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";

const NewItem: NextPageWithLayout = () => {
    return (
        <div className="flex flex-1 justify-center">
            <div className="my-4 flex w-4/5 flex-col rounded bg-white p-6">
                <h2 className="text-2xl font-medium tracking-wide">新增商品</h2>

                <form action="/api" method="post" className="relative flex-1">
                    <PhotoUploader />

                    <Input
                        fieldName="商品名稱"
                        name="name"
                        id="f1"
                        className="mt-10"
                    />

                    <div className="mt-10 flex">
                        <Input
                            fieldName="定價"
                            name="price"
                            id="f2"
                            className="mr-8 flex-1"
                        />

                        <Input
                            fieldName="庫存"
                            name="inventory"
                            id="f3"
                            className="flex-1"
                        />
                    </div>

                    <RichText
                        filedName="商品描述"
                        id="f4"
                        name="description"
                        columns={30}
                        rows={10}
                    />

                    <button
                        type="submit"
                        className="absolute right-0 bottom-0 rounded bg-indian-yellow py-1.5 px-4 font-medium tracking-wide text-white disabled:bg-indian-yellow/50"
                    >
                        新增商品
                    </button>
                </form>
            </div>
        </div>
    );
};

NewItem.getLayout = getSellerDashboardLayout;

export default NewItem;
