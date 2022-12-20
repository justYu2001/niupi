import { ReactElement, type ReactNode } from "react";
import { NextPage } from "next";

declare module "next" {
    type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
        getLayout: (page: ReactElement) => ReactNode;
    }
}
