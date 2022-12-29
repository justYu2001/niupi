import { FileUpload, FilesUpload } from "@uploadcare/react-widget";

export const isFilesInformation = (
    value: FilesUpload | FileUpload | null
): value is FilesUpload => {
    const filesInformation = value as FilesUpload;
    return (
        filesInformation.files !== undefined &&
        filesInformation.promise !== undefined
    );
};
