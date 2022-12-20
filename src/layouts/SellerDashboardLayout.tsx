import { ReactElement, useState } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { BsBoxSeam } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { IconBaseProps } from "react-icons/lib";
import { MdOutlineStorefront } from "react-icons/md";

import SellerDashboardNavBar from "@/components/SellerDashboardNavBar";

interface SellerDashboardLayoutProps {
    children: ReactElement;
}

export default function SellerDashboardLayout({
    children,
}: SellerDashboardLayoutProps) {
    return (
        <div className="flex h-screen flex-col">
            <SellerDashboardNavBar />
            <main className="flex flex-1">
                <SideBar />
                {children}
            </main>
        </div>
    );
}

export const getSellerDashboardLayout = (page: ReactElement) => {
    return <SellerDashboardLayout>{page}</SellerDashboardLayout>;
};

interface SideBarLinkData {
    name: string;
    url: string;
}

interface SideBarMenuData {
    icon: {
        Icon: IconType;
        iconProps: IconBaseProps;
    };
    name: string;
    url: string;
    links: SideBarLinkData[];
}

const sideBarMenus: SideBarMenuData[] = [
    {
        icon: {
            Icon: BsBoxSeam,
            iconProps: {
                size: 16,
            },
        },
        name: "商品管理",
        url: "/item",
        links: [
            {
                name: "我的商品",
                url: "/list",
            },
            {
                name: "新增商品",
                url: "/new",
            },
        ],
    },
    {
        icon: {
            Icon: MdOutlineStorefront,
            iconProps: {
                size: 20,
            },
        },
        name: "賣場管理",
        url: "/store",
        links: [
            {
                name: "賣場資訊",
                url: "/profile",
            },
        ],
    },
];

function SideBar() {
    return (
        <nav className="bg-white py-4 px-10">
            <ul className="select-none tracking-wide">
                {sideBarMenus.map((menu) => (
                    <SideBarMenu data={menu} key={menu.name} />
                ))}
            </ul>
        </nav>
    );
}

interface SideBarMenuContainerProps {
    data: SideBarMenuData;
}

function SideBarMenu({ data }: SideBarMenuContainerProps) {
    const { icon, name, url, links } = data;
    const { Icon, iconProps } = icon;

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((previousState) => !previousState);

    return (
        <li className="py-2">
            <div
                className="flex cursor-pointer items-center"
                onClick={toggleMenu}
            >
                <div className="flex w-5 justify-center">
                    <Icon {...iconProps} />
                </div>
                <p className="ml-2 mr-10 text-xl">{name}</p>
                {isOpen ? <IoIosArrowDown /> : <IoIosArrowBack />}
            </div>
            <ul className={`pl-8 pt-1 ${isOpen ? "list-item" : "hidden"}`}>
                {links.map((link) => (
                    <SideBarLink
                        href={`/seller${url}${link.url}`}
                        key={link.name}
                    >
                        {link.name}
                    </SideBarLink>
                ))}
            </ul>
        </li>
    );
}

interface SideBarLinkProps {
    href: string;
    children: string;
}

function SideBarLink({ href, children }: SideBarLinkProps) {
    return (
        <li className="py-1">
            <Link href={href}>
                <span className="cursor-pointer transition-all duration-300 hover:text-indian-yellow">
                    {children}
                </span>
            </Link>
        </li>
    );
}
