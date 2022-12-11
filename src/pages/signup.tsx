import { FormEvent, HTMLInputTypeAttribute } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { type UseMutateFunction, useMutation } from "@tanstack/react-query";

import { SignUpAPIRequestBody, type User } from "@/utils/auth";
import encrypt from "@/utils/encrypt";

const SignUp: NextPage = () => {
    return (
        <>
            <Head>
                <title>牛啤購物 - 註冊</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-full flex-col bg-indian-yellow md:h-screen md:flex-row">
                <header className="min-w-fit self-center text-black md:flex-1">
                    <Link href="/" legacyBehavior>
                        <a>
                            <Logo />
                        </a>
                    </Link>
                    <div className="hidden text-center text-black md:block">
                        <p className="md:text-2xl">北科最牛逼的購物平台</p>
                        <small className="md:text-lg">
                            Best Shopping Platform Made by NTUT CSIE
                        </small>
                    </div>
                </header>

                <main className="mt-3 flex-1 rounded-t-[2.5rem] bg-white py-5 px-6 md:m-0 md:flex md:flex-col md:justify-center md:rounded-none md:p-0">
                    <div className="md:px-40">
                        <Form />
                        <Link href="/signin">
                            <p className="mt-1 text-center">
                                已經是會員嗎？
                                <span className="cursor-pointer underline">
                                    點此登入
                                </span>
                            </p>
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
};

export default SignUp;

function Logo() {
    return (
        <div className="flex items-center justify-center">
            <div className="relative h-36 w-36 md:h-48 md:w-48">
                <Image
                    src="/images/niupi-logo-black.png"
                    layout="fill"
                    objectFit="cover"
                    alt="logo"
                />
            </div>
            <div className="relative px-2 py-4 text-right leading-none text-black md:pb-8 md:pt-6">
                <h1 className="text-3xl md:text-4xl">牛啤購物</h1>
                <small className="px-1 text-lg md:mt-1 md:text-xl">Niupi</small>
                <div className="absolute -left-4 right-0 bottom-1 block border-t border-black md:-left-6"></div>
            </div>
        </div>
    );
}

interface SignUpFormData {
    email: { value: string };
    username: { value: string };
    password: { value: string };
}

type SubmitHandlerCallback = UseMutateFunction<
    AxiosResponse,
    unknown,
    SignUpAPIRequestBody,
    unknown
>;

const handleSubmit = (callback: SubmitHandlerCallback) => {
    return async (event: FormEvent) => {
        event.preventDefault();

        const formData = event.target as typeof event.target & SignUpFormData;
        const encryptedPassword = await encrypt(formData.password.value);

        callback({
            username: formData.username.value,
            email: formData.email.value,
            password: encryptedPassword,
        });
    };
};

const fetchSignUpAPI = (requestBody: SignUpAPIRequestBody) => {
    return axios.post<User>("api/auth/signup", requestBody);
};

function Form() {
    const { data, isLoading, mutate, error } = useMutation<
        AxiosResponse<User>,
        AxiosError<string>,
        SignUpAPIRequestBody
    >({
        mutationFn: fetchSignUpAPI,
        onSuccess: async ({ data }, requestBody) => {
            signIn("credentials", {
                email: data.email,
                password: requestBody.password,
                callbackUrl: window.location.origin,
            });
        },
    });

    return (
        <>
            <h2 className="mt-2 text-center text-3xl font-medium tracking-wide">
                註冊
            </h2>
            <form
                action="/api/auth/signup"
                method="POST"
                className="flex flex-col pb-2"
                onSubmit={handleSubmit(mutate)}
            >
                <div className="flex flex-col">
                    <Input id="username" filedName="使用者名稱" />
                    <Input id="email" filedName="電子郵件" />
                    <Input id="password" filedName="密碼" type="password" />
                    <p className="mb-7 mt-1.5 h-4 text-lg text-red-500">
                        {error?.response?.data}
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || data?.status === 200}
                    className="my-3 rounded-md bg-black py-2 text-lg text-white disabled:bg-black/50 md:mt-4 md:mb-2.5"
                >
                    註冊
                </button>
            </form>
        </>
    );
}

interface InputProps {
    filedName: string;
    id: string;
    type?: HTMLInputTypeAttribute;
}

function Input({ filedName, id, type = "text" }: InputProps) {
    return (
        <>
            <label htmlFor={id} className="my-2 text-lg">
                {filedName}
            </label>
            <input
                type={type}
                id={id}
                autoComplete="off"
                className="mb-2 border-2 border-slate-300 p-2 text-xl outline-none transition-all duration-300 focus:border-indian-yellow"
            />
        </>
    );
}
