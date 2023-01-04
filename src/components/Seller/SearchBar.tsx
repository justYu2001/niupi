import { AiOutlineSearch } from "react-icons/ai";

function SearchBar() {
    return (
        <div className="my-8 flex items-center rounded border-2 border-slate-300 outline-none transition-all duration-300 focus-within:border-indian-yellow">
            <input
                type="text"
                placeholder="輸入關鍵字以搜尋商品"
                className="peer flex-1 p-2 outline-none"
            />
            <AiOutlineSearch className="mr-2 text-2xl text-slate-300" />
        </div>
    );
}

export default SearchBar;
