import { useRef, useState } from "react";
import Image from "next/image";
import { IoImage } from "react-icons/io5";
import {
    Widget as FileUploader,
    WidgetAPI,
    FilesUpload,
    FileUpload,
} from "@uploadcare/react-widget";

import { env } from "@/env/client.mjs";
import style from "@/styles/uploadcare.module.css";
import { isFilesInformation } from "@/utils/uploadcare";

function PhotoUploader() {
    const fileUploaderRef = useRef<WidgetAPI>(null);

    const openFileUploader = () => fileUploaderRef.current?.openDialog();

    const [photoIds, setPhotoIds] = useState<string[]>([]);

    const updateFiles = (filesInformation: FilesUpload | FileUpload | null) => {
        if (!isFilesInformation(filesInformation)) {
            return;
        }

        const newPhotoIds: string[] = [];

        const files = filesInformation.files();
        files.forEach((file) => {
            file.done(({ uuid }) => {
                uuid && newPhotoIds.push(uuid);
            });
        });

        setPhotoIds(newPhotoIds);
    };

    return (
        <div className="mt-10">
            <label
                htmlFor="photos"
                className="my-2 block font-medium tracking-wide text-slate-400"
                onClick={openFileUploader}
            >
                商品圖片
            </label>
            <input type="hidden" name="photoIds" value={photoIds.join()} />
            <div
                className="flex cursor-pointer items-center justify-between rounded border-2 border-dashed border-slate-300 p-3"
                onClick={openFileUploader}
            >
                <div className="flex items-center">
                    {photoIds.length > 0 ? (
                        <PreviewPhotos photoIds={photoIds} />
                    ) : (
                        <Placeholder />
                    )}
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
                        onDialogClose={updateFiles}
                    />
                </div>
            </div>
        </div>
    );
}

export default PhotoUploader;

function Placeholder() {
    return (
        <>
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-indian-yellow/20">
                <IoImage className="h-8 w-8 text-indian-yellow" />
            </div>
            <p className="ml-8 tracking-wide">點擊或拖曳以上傳圖片</p>
        </>
    );
}

interface PreviewPhotosProps {
    photoIds: string[];
}

function PreviewPhotos({ photoIds }: PreviewPhotosProps) {
    return (
        <ul className="flex gap-x-4">
            {photoIds.map((photoId) => (
                <li
                    key={photoId}
                    className="relative flex h-20 w-20 items-center"
                >
                    <Image
                        src={`https://ucarecdn.com/${photoId}/-/preview/`}
                        alt={`${photoId}-preview`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </li>
            ))}
        </ul>
    );
}
