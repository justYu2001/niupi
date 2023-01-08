import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

export default function NavBar() {
    const session = useSession();
    const isLoggedIn = session.status === "authenticated";

    return (
        <nav className="float-right">
            <ul className="flex items-center px-4 py-6 font-medium tracking-wide">
                {isLoggedIn ? (
                    <>
                        <li className="mx-2">
                            <Link href="/seller">賣家中心</Link>
                        </li>
                        <li className="mx-2">
                            <button onClick={() => signOut()}>登出</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="mx-2">
                            <Link href="/signin">登入</Link>
                        </li>
                        <li className="mx-2 rounded bg-black py-1 px-6 text-white">
                            <Link href="/signup">註冊</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
