import Image from "next/image";

import { VscTrash } from "react-icons/vsc";

function ItemTable() {
    return (
        <table className="w-full">
            <thead className="border-b border-slate-400">
                <tr>
                    <th className="table-header-cell">商品名稱</th>
                    <th className="table-header-cell">價格</th>
                    <th className="table-header-cell">庫存</th>
                    <th className="table-header-cell"></th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    );
}

export default ItemTable;

interface TableRowProps {
    name: string;
    photo: string;
    price: number;
    inventory: number;
}

function TableRow({ name, photo, price, inventory }: TableRowProps) {
    return (
        <tr className="border-b border-slate-300 last:border-none">
            <td className="table-body-cell flex items-center gap-x-4">
                <Image
                    src={`https://ucarecdn.com/${photo}/-/preview/-/quality/smart/-/format/auto/`}
                    alt="item-photo"
                    width={40}
                    height={40}
                />
                <p className="font-medium">{name}</p>
            </td>
            <td className="table-body-cell">NT$ {price}</td>
            <td className="table-body-cell">{inventory}</td>
            <td className="table-body-cell float-right pr-14">
                <VscTrash className="cursor-pointer text-xl text-slate-400 transition-all duration-300 hover:text-red-500" />
            </td>
        </tr>
    );
}
