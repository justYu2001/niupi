import { FormEvent, HTMLInputTypeAttribute } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import { signIn, SignInResponse } from "next-auth/react";
import { useMutation, type UseMutateFunction } from "@tanstack/react-query";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import encrypt from "@/utils/encrypt";

const SignIn: NextPage = () => {
    return (
        <>
            <Head>
                <title>牛啤購物 - 登入</title>
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
                        <Link href="/signup">
                            <p className="mt-1 text-center">
                                還沒有帳號嗎？
                                <span className="cursor-pointer underline">
                                    點此註冊
                                </span>
                            </p>
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
};

export default SignIn;

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
                <h1 className="text-3xl">牛啤購物</h1>
                <small className="px-1 text-lg">Niupi</small>
                <div className="absolute -left-4 right-0 bottom-1 block border-t border-black  md:-left-6"></div>
            </div>
        </div>
    );
}

interface SignInFormData {
    email: { value: string };
    password: { value: string };
}

interface SignInAPIRequestBody {
    email: string;
    password: string;
}

type SubmitHandlerCallback = UseMutateFunction<
    SignInResponse | undefined,
    unknown,
    SignInAPIRequestBody,
    unknown
>;

const handleSubmit = (callback: SubmitHandlerCallback) => {
    return async (event: FormEvent) => {
        event.preventDefault();

        const formData = event.target as typeof event.target & SignInFormData;

        const encryptedPassword = await encrypt(formData.password.value);

        const data: SignInAPIRequestBody = {
            email: formData.email.value,
            password: encryptedPassword,
        };

        callback(data);
    };
};

const fetchSignInAPI = async ({ email, password }: SignInAPIRequestBody) => {
    return await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: window.location.origin,
    });
};

function Form() {
    const router = useRouter();

    const { data, isLoading, mutate } = useMutation({
        mutationFn: fetchSignInAPI,
        onSuccess(data) {
            if (data?.ok) {
                router.push("/");
            }
        },
    });

    return (
        <>
            <h2 className="mt-2 text-center text-3xl font-medium tracking-wide">
                登入
            </h2>
            <form
                method="post"
                action="/api/auth/callback/credentials"
                onSubmit={handleSubmit(mutate)}
                className="flex flex-1 flex-col pb-2"
            >
                <Input id="email" filedName="電子郵件" />
                <Input id="password" filedName="密碼" type="password" />
                <p className="mb-7 mt-1.5 h-4 text-lg text-red-500">
                    {data?.error}
                </p>
                <button
                    disabled={isLoading || data?.ok}
                    type="submit"
                    className="my-3 rounded-md bg-black py-2 text-lg text-white disabled:bg-black/50 md:mt-4 md:mb-2.5"
                >
                    登入
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

function Input({ id, filedName, type = "text" }: InputProps) {
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
