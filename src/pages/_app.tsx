import { useState } from "react";
import type { NextPageWithLayout } from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import "@/styles/globals.css";

type MyAppProps = AppProps & {
    Component: NextPageWithLayout;
    pageProps: {
        session: Session | null;
    };
};

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
}: MyAppProps) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate>
                <SessionProvider session={session}>
                    {getLayout(<Component {...pageProps} />)}
                </SessionProvider>
            </Hydrate>
        </QueryClientProvider>
    );
};

export default MyApp;
