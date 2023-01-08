import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import { AiOutlineSearch } from "react-icons/ai";

import NavBar from "@/components/NavBar";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>牛啤購物</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="h-screen bg-indian-yellow">
                <header className="relative z-10">
                    <NavBar />
                </header>
                <main className="absolute inset-0 flex items-center justify-around">
                    <div>
                        <h1 className="text-6xl font-medium tracking-wide">
                            牛啤購物
                        </h1>
                        <label className="mt-8 flex cursor-text items-center rounded-full bg-white py-4 pl-6 pr-3 shadow-md">
                            <input
                                type="text"
                                placeholder="今天想買什麼？"
                                className="peer w-72 text-2xl outline-none"
                            />
                            <AiOutlineSearch className="text-3xl text-slate-400" />
                        </label>
                    </div>
                    <Logo />
                </main>
            </div>
        </>
    );
};

export default Home;

function Logo() {
    return (
        <div className="relative h-96 w-96">
            <Image
                src="/images/niupi-logo-black.png"
                layout="fill"
                alt="logo"
            />
        </div>
    );
}
