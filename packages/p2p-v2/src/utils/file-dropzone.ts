import { ReactElement, ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';

export type TFileDropzone = DropzoneOptions & {
    className?: string;
    errorMessage: string;
    filenameLimit?: number;
    hoverMessage: string;
    maxSize?: number;
    message?: ReactNode | ((open?: () => void) => ReactNode);
    previewSingle?: ReactElement;
    validationErrorMessage?: ReactNode | ((open?: () => void) => ReactNode);
    value: (File & { file: Blob })[];
};
