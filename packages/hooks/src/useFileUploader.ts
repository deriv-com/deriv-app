import { DocumentUploader } from '@binary-com/binary-document-uploader';
import { TFile, TSettings, WS, compressImageFiles, readFiles } from '@deriv/shared';
import { useCallback, useRef, useState } from 'react';

const fileReadErrorMessage = (filename: string) => {
    return `Unable to read file ${filename}`;
};

const useFileUploader = () => {
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useCallback((settings?: TSettings) => {
        const uploader = new DocumentUploader({ connection: WS.getSocket() });

        // if no settings, return uploader instance
        if (!settings) return uploader;

        return new Promise((resolve, reject) => {
            if (!inputRef.current?.files?.length) reject(new Error('No files selected'));

            let is_any_file_error = false;
            let file_error: string | null = null;

            compressImageFiles(inputRef.current?.files)
                .then(files_to_process => {
                    readFiles(files_to_process, fileReadErrorMessage, settings)
                        .then(processed_files => {
                            processed_files.forEach(file => {
                                if (file && 'message' in file) {
                                    is_any_file_error = true;
                                    file_error = file.message;
                                    reject(file.message);
                                }
                            });
                            const total_to_upload = processed_files.length;
                            if (is_any_file_error || !total_to_upload) {
                                return reject(new Error(file_error || 'Something went wrong!')); // don't start submitting files until all front-end validation checks pass
                            }

                            // send files
                            const uploader_promise = uploader
                                .upload(processed_files[0])
                                .then((api_response: unknown) => api_response);
                            resolve(uploader_promise);
                        })
                        .catch(error => setError(error));
                })
                .catch(error => setError(error));
        });
    }, []);

    return {
        files,
        setFiles,
        error,
        upload,
    };
};
