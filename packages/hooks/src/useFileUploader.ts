import DocumentUploader from '@binary-com/binary-document-uploader';
import { useMutation } from '@deriv/api';
import { WS, compressImageFiles, readFiles } from '@deriv/shared';
import { useCallback, useMemo, useState } from 'react';

type TSettingsPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>>[0]>['payload']
>;

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
    [key: string]: any;
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
                [key: string]: any;
            }>((resolve, reject) => {
                let is_any_file_error = false;
                let file_error: string | null = null;

                compressImageFiles()
                    .then((files_to_process: Blob[]) => {
                        readFiles(files_to_process, fileReadErrorMessage, settings ?? {})
                            .then((processed_files: TFile[]) => {
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
                                const uploader_promise = uploader_instance
                                    .upload(processed_files[0])
                                    .then((api_response: TUploaderResponse) => api_response);
                                resolve(uploader_promise);
                            })
                            .catch((error: unknown) => {
                                setError(error);
                                reject(error);
                            });
                    })
                    .catch((error: unknown) => {
                        setError(error);
                        reject(error);
                    });
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
