import DocumentUploader from '@binary-com/binary-document-uploader';
import { useMutation } from '@deriv/api';
import { WS, compressImageFiles, readFiles } from '@deriv/shared';
import { useCallback, useMemo, useState } from 'react';

type TSettingsPayload = Partial<Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>[0]['payload']>;

type TFile =
    | Partial<
          TSettingsPayload & {
              filename: File['name'];
              buffer: FileReader['result'];
              documentFormat: string;
              file_size: File['size'];
          }
      >
    | {
          message: string;
      };

type TUploaderResponse = {
    [key: string]: unknown;
    message?: string;
    warning?: string;
};
const fileReadErrorMessage = (filename: string) => {
    return `Unable to read file ${filename}`;
};

/**
 * Custom hook to handle file uploading with the binary-document-uploader package
 */
const useFileUploader = () => {
    const [error, setError] = useState<unknown>(null);
    const uploader_instance = useMemo(() => new DocumentUploader({ connection: WS.getSocket() }), []);

    const upload = useCallback(
        async (files: File[], settings?: TSettingsPayload, onError?: () => void) => {
            if (!files?.length) return Promise.reject(new Error('No files selected'));

            return new Promise<{
                message?: string;
                warning?: string;
                [key: string]: unknown;
            }>((resolve, reject) => {
                let is_any_file_error = false;
                let file_error: string | null = null;

                (async () => {
                    try {
                        const compressed_files: Blob[] = await compressImageFiles(files);
                        const processed_files: TFile[] = await readFiles(
                            compressed_files,
                            fileReadErrorMessage,
                            settings ?? {}
                        );
                        processed_files.forEach(file => {
                            if (file && 'message' in file) {
                                is_any_file_error = true;
                                file_error = file.message;
                                reject(file.message);
                            }
                        });
                        if (is_any_file_error || !processed_files.length) {
                            onError?.();
                            return reject(new Error(file_error ?? 'Something went wrong!')); // don't start submitting files until all front-end validation checks pass
                        }

                        // send files
                        const response: TUploaderResponse = await uploader_instance.upload(processed_files[0]);
                        resolve(response);
                    } catch (error: unknown) {
                        setError(error);
                        reject(error);
                    }
                })();
            });
        },
        [uploader_instance]
    );

    return {
        /**
         * Error message from the file uploader
         */
        error,
        /**
         * Uploads a file to the server with the binary-document-uploader package after compressing and reading the file with meta data
         */
        upload,
        /**
         * Instance of the binary-document-uploader
         */
        uploader_instance,
    };
};

export default useFileUploader;
