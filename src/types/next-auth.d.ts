import { DefaultSession, DefaultUser } from "next-auth";
import { z } from "zod";

import { UserSchema } from "@/utils/auth";

declare module "next-auth" {
    interface User extends z.infer<typeof UserSchema>, DefaultUser {}

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user?: User & DefaultSession["user"];
    }
}
