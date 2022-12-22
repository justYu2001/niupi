import Link from "next/link";
import Image from "next/image";
import useSession from "@/hooks/session";

export default function SellerDashboardNavBar() {
    const { session, isLoading } = useSession();

    return (
        <header className="flex items-center justify-between bg-white py-2 px-4">
            <Link href="/seller" legacyBehavior>
                <a>
                    <Logo />
                </a>
            </Link>

            {isLoading ? (
                <p className="h-4 w-20 animate-pulse rounded-full bg-slate-200"></p>
            ) : (
                <p className="px-4">{session?.user?.name}</p>
            )}
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
