import type { NextPage } from "next";
import Head from "next/head";
import NavBar from "@/components/NavBar";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>牛啤購物</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
                <NavBar />
            </header>
        </>
    );
};

export default Home;
