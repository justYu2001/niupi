interface RichTextProps {
    filedName: string;
    id: string;
    name: string;
    columns: number;
    rows: number;
}

function RichText({ filedName, id, name, columns, rows }: RichTextProps) {
    return (
        <div className="mt-10">
            <label
                htmlFor={id}
                className="my-2 block font-medium tracking-wide text-slate-400"
            >
                {filedName}
            </label>
            <textarea
                name={name}
                id={id}
                cols={columns}
                rows={rows}
                className="block w-full resize-none rounded border-2 border-slate-300 p-2 outline-none transition-all duration-300 focus:border-indian-yellow"
            ></textarea>
        </div>
    );
}

export default RichText;
