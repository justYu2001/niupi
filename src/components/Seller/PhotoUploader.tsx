import { useRef } from "react";
import { IoImage } from "react-icons/io5";
import { Widget as FileUploader, WidgetAPI } from "@uploadcare/react-widget";

import style from "@/styles/uploadcare.module.css";
import { env } from "@/env/client.mjs";

function PhotoUploader() {
    const fileUploaderRef = useRef<WidgetAPI>(null);

    const openFileUploader = () => fileUploaderRef.current?.openDialog();

    return (
        <div className="mt-10">
            <label
                htmlFor="photos"
                className="my-2 block font-medium tracking-wide text-slate-400"
                onClick={openFileUploader}
            >
                上傳商品圖片
            </label>
            <div
                className="flex cursor-pointer items-center justify-between rounded border-2 border-dashed border-slate-300 p-3"
                onClick={openFileUploader}
            >
                <div className="flex items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-indian-yellow/20">
                        <IoImage className="h-8 w-8 text-indian-yellow" />
                    </div>
                    <p className="ml-8 tracking-wide">點擊或拖曳以上傳圖片</p>
                </div>
                <div
                    className={`${style["upload-button"]} ${style["dialog-button-primary"]} hidden`}
                >
                    <FileUploader
                        ref={fileUploaderRef}
                        publicKey={env.NEXT_PUBLIC_UPLOADCARE_API_KEY}
                        tabs="file"
                        locale="zhTW"
                        multiple={true}
                        imagesOnly={true}
                    />
                </div>
            </div>
        </div>
    );
}

export default PhotoUploader;
