import { NextPageWithLayout } from "next";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";

import Input from "@/components/Seller/Input";
import PhotoUploader from "@/components/Seller/PhotoUploader";
import RichText from "@/components/Seller/RichText";
import { useStoreId } from "@/hooks/store";
import { getSellerDashboardLayout } from "@/layouts/SellerDashboardLayout";
import { NewItem } from "@/pages/api/items";

const addItem = (requestBody: NewItem) => {
    return axios.post("/api/items", requestBody);
};

type SubmitHandlerCallback = UseMutateFunction<
    AxiosResponse,
    unknown,
    NewItem,
    unknown
>;

interface FormData {
    name: { value: string };
    price: { value: string };
    inventory: { value: string };
    description: { value: string };
    photoIds: { value: string };
}

const handleFormSubmit = (
    storeId: string | undefined,
    callback: SubmitHandlerCallback
) => {
    if (storeId === undefined) {
        return () => {
            return;
        };
    }

    return (event: FormEvent) => {
        event.preventDefault();

        const { name, price, inventory, description, photoIds } =
            event.target as FormData & typeof event.target;

        callback({
            storeId,
            name: name.value,
            price: parseInt(price.value),
            inventory: parseInt(inventory.value),
            description: description.value,
            photoIds: photoIds.value.split(","),
        });
    };
};

const NewItemPage: NextPageWithLayout = () => {
    const { storeId } = useStoreId();

    const formRef = useRef<HTMLFormElement>(null);

    const router = useRouter();

    const { mutate, isLoading } = useMutation({
        mutationFn: addItem,
        onSuccess: () => router.replace("/seller/item/list"),
    });

    return (
        <div className="flex flex-1 justify-center">
            <div className="my-4 flex w-4/5 flex-col rounded bg-white p-6">
                <h2 className="text-2xl font-medium tracking-wide">新增商品</h2>

                <form
                    ref={formRef}
                    action="/api"
                    method="post"
                    className="relative flex-1"
                    onSubmit={handleFormSubmit(storeId, mutate)}
                >
                    <PhotoUploader />

                    <Input
                        fieldName="商品名稱"
                        name="name"
                        id="f1"
                        className="mt-10"
                    />

                    <div className="mt-10 flex">
                        <Input
                            type="number"
                            fieldName="定價"
                            name="price"
                            id="f2"
                            className="mr-8 flex-1"
                        />

                        <Input
                            type="number"
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
                        rows={5}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-0 bottom-0 rounded bg-indian-yellow py-1.5 px-4 font-medium tracking-wide text-white disabled:bg-indian-yellow/50"
                    >
                        新增商品
                    </button>
                </form>
            </div>
        </div>
    );
};

NewItemPage.getLayout = getSellerDashboardLayout;

export default NewItemPage;
