import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const SignUp: NextPage = () => {
    return (
        <>
            <Head>
                <title>牛啤購物-註冊</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-full flex-col bg-indian-yellow">
                <header className="text-black">
                    <div className="flex items-center justify-center">
                        <div className="relative h-36 w-36">
                            <Image
                                src="/images/niupi-logo-black.png"
                                layout="fill"
                                objectFit="cover"
                                alt="logo"
                            />
                        </div>
                        <div className="relative px-2 py-4 text-right leading-none">
                            <h1 className="text-3xl">牛啤購物</h1>
                            <small className="px-1 text-lg">Niupi</small>
                            <div className="absolute -left-4 right-0 bottom-1 block border-t border-black"></div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p>北科最牛逼的購物平台</p>
                        <small>Best Shopping Platform Made by NTUT CSIE</small>
                    </div>
                </header>

                <main className="mt-6 flex-1 rounded-t-[2.5rem] bg-white py-5 px-6">
                    <h2 className="text-center text-2xl font-medium tracking-wide">
                        註冊
                    </h2>
                    <form action="" className="flex flex-col pb-2">
                        <Input id="username" filedName="使用者名稱" />
                        <Input id="email" filedName="電子郵件" />
                        <Input id="password" filedName="密碼" />
                        <button
                            type="submit"
                            className="my-3 rounded-md bg-black py-2 text-lg text-white"
                        >
                            註冊
                        </button>
                    </form>
                    <Link href="/signin">
                        <p className="mt-1 text-center">
                            已經是會員嗎？
                            <span className="underline">點此登入</span>
                        </p>
                    </Link>
                </main>
            </div>
        </>
    );
};

export default SignUp;

interface InputProps {
    filedName: string;
    id: string;
}

function Input({ filedName, id }: InputProps) {
    return (
        <>
            <label htmlFor={id} className="my-2 text-lg">
                {filedName}
            </label>
            <input
                type="text"
                id={id}
                className="mb-2 border-2 border-slate-300 p-2 text-2xl outline-none transition-all duration-300 focus:border-indian-yellow"
            />
        </>
    );
}
