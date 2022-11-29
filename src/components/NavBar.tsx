import Link from "next/link";

export default function NavBar() {
    return (
        <div className="flex justify-between p-4">
            <h1 className="text-2xl">牛啤購物</h1>
            <nav>
                <ul className="flex">
                    <li className="mx-2">
                        <Link href="/signup">註冊</Link>
                    </li>
                    <li className="mx-2">
                        <Link href="/signin">登入</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
