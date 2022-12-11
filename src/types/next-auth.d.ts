import { DefaultSession, DefaultUser } from "next-auth";

import { type User as TUser } from "@/utils/auth";

declare module "next-auth" {
    interface User extends TUser, DefaultUser {}

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user?: User & DefaultSession["user"];
    }
}
