import { ReactElement, ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';

export type TFileDropzone = {
    className?: string;
    error_message: string;
    filename_limit?: number;
    hover_message: string;
    max_size?: number;
    message?: ReactNode | ((open?: () => void) => ReactNode);
    preview_single?: ReactElement;
    validation_error_message?: ReactNode | ((open?: () => void) => ReactNode);
    value: Array<File & { file: Blob }>;
} & DropzoneOptions;
