import { useState } from "react";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </Hydrate>
        </QueryClientProvider>
    );
};

export default MyApp;
