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

            <div className="flex h-full flex-col bg-indian-yellow md:h-screen md:flex-row">
                <header className="min-w-fit self-center text-black md:flex-1">
                    <Link href="/" legacyBehavior>
                        <a>
                            <Logo />
                        </a>
                    </Link>
                    <div className="hidden text-center text-black">
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
                                <span className="underline">點此登入</span>
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

function Form() {
    return (
        <>
            <h2 className="mt-2 text-center text-3xl font-medium tracking-wide">
                註冊
            </h2>
            <form action="" className="flex flex-col pb-2">
                <div className="flex flex-col">
                    <Input id="username" filedName="使用者名稱" />
                    <Input id="email" filedName="電子郵件" />
                    <Input id="password" filedName="密碼" />
                    <p className="mb-7 mt-1.5 h-4 text-lg text-red-500"></p>
                </div>
                <button
                    type="submit"
                    className="my-3 rounded-md bg-black py-2 text-lg text-white md:my-6"
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
                autoComplete="off"
                className="mb-2 border-2 border-slate-300 p-2 text-xl outline-none transition-all duration-300 focus:border-indian-yellow"
            />
        </>
    );
}
