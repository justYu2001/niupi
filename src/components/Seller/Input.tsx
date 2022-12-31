interface InputProps {
    fieldName: string;
    name: string;
    id: string;
    type?: string;
    className?: string;
    defaultValue?: string | null | undefined;
}

function Input({
    fieldName,
    name,
    id,
    defaultValue,
    type = "text",
    className = "",
}: InputProps) {
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="my-1 block font-medium tracking-wide text-slate-400"
            >
                {fieldName}
            </label>
            <input
                type={type}
                defaultValue={defaultValue ?? ""}
                id={id}
                name={name}
                autoComplete="do-not-autofill"
                className="block w-full rounded border-2 border-slate-300 p-2 outline-none transition-all duration-300 focus:border-indian-yellow"
            />
        </div>
    );
}

export default Input;
