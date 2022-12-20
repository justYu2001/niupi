import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function SellerDashboardNavBar() {
    const session = useSession();

    return (
        <header className="flex items-center justify-between bg-white py-2 px-4">
            <Link href="/seller" legacyBehavior>
                <a>
                    <Logo />
                </a>
            </Link>
            <p className="px-4">{session.data?.user?.name}</p>
        </header>
    );
}

function Logo() {
    return (
        <h1 className="flex items-center">
            <Image
                src="/images/niupi-logo-black.png"
                height={60}
                width={60}
                alt="logo"
            />
            <p className="mx-2 text-xl">牛啤賣家中心</p>
        </h1>
    );
}
