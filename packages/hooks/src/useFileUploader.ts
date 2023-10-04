// import { useMutation } from '@deriv/api';
// import { WS, compressImageFiles, readFiles } from '@deriv/shared';
// import { useCallback, useRef, useState } from 'react';
// import { DocumentUploader } from '@binary-com/binary-document-uploader'; // Using require because this package has no types defined

// type TSettingsPayload = NonNullable<
//     NonNullable<NonNullable<Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>>[0]>['payload']
// >;

// const fileReadErrorMessage = (filename: string) => {
//     return `Unable to read file ${filename}`;
// };

// /**
//  * Custom hook to handle file uploading with the binary-document-uploader package
//  */
// const useFileUploader = () => {
//     const [error, setError] = useState<unknown>(null);
//     const ref = useRef<HTMLInputElement>(null);

//     /**
//      * Uploads a file to the server
//      * @param {FileList} files - list of files to upload
//      * @param {TSettings} settings - settings for the file upload
//      * @returns {Promise} - a promise that resolves when the upload is complete
//      */
//     const uploader = useCallback((files: FileList, settings?: TSettingsPayload, onError?: () => void) => {
//         if (!ref.current?.files?.length) return Promise.reject(new Error('No files selected'));

//         const uploader = new DocumentUploader({ connection: WS.getSocket() });

//         // if no settings, return uploader instance
//         if (!settings) return uploader;

//         return new Promise((resolve, reject) => {
//             let is_any_file_error = false;
//             let file_error: string | null = null;

//             compressImageFiles(files)
//                 .then(files_to_process => {
//                     readFiles(files_to_process, fileReadErrorMessage, settings)
//                         .then(processed_files => {
//                             processed_files.forEach(file => {
//                                 if (file && 'message' in file) {
//                                     is_any_file_error = true;
//                                     file_error = file.message;
//                                     reject(file.message);
//                                 }
//                             });
//                             const total_to_upload = processed_files.length;
//                             if (is_any_file_error || !total_to_upload) {
//                                 onError?.();
//                                 return reject(new Error(file_error ?? 'Something went wrong!')); // don't start submitting files until all front-end validation checks pass
//                             }

//                             // send files
//                             const uploader_promise = uploader
//                                 .upload(processed_files[0])
//                                 .then((api_response: unknown) => api_response);
//                             resolve(uploader_promise);
//                         })
//                         .catch(error => setError(error));
//                 })
//                 .catch(error => setError(error));
//         });
//     }, []);

//     return {
//         error,
//         uploader,
//     };
// };

// export default useFileUploader;

const { DocumentUploader } = require('@binary-com/binary-document-uploader'); // Using require because this package has no types defined
import { useMutation } from '@deriv/api';
import { WS, compressImageFiles, readFiles, TFileObject } from '@deriv/shared';
import { useCallback, useRef, useState } from 'react';

type TSettingsPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>>[0]>['payload']
>;

const fileReadErrorMessage = (filename: string) => {
    return `Unable to read file ${filename}`;
};

/**
 * Custom hook to handle file uploading with the binary-document-uploader package
 */
const useFileUploader = () => {
    const [error, setError] = useState<string | null>(null);
    const ref = useRef<HTMLInputElement>(null);

    /**
     * Uploads a file to the server
     * @param {FileList} files - list of files to upload
     * @param {TSettings} settings - settings for the file upload
     * @returns {Promise} - a promise that resolves when the upload is complete
     */
    const uploader = useCallback(async (files: FileList, settings?: TSettingsPayload, onError?: () => void) => {
        if (!ref.current?.files?.length) return Promise.reject(new Error('No files selected'));

        const uploader_instance = new DocumentUploader({ connection: WS.getSocket() });

        // if no settings, return uploader instance
        if (!settings) return uploader_instance;

        let is_any_file_error = false;
        let file_error: string | null = null;
        try {
            const files_to_process = await compressImageFiles(files);
            const processed_files: Array<TFileObject | { message: string }> = await readFiles(
                files_to_process,
                fileReadErrorMessage,
                settings
            );
            processed_files.forEach(file => {
                if (file && 'message' in file) {
                    is_any_file_error = true;
                    file_error = file.message;
                    throw new Error(file.message);
                }
            });
            const total_to_upload = processed_files.length;
            if (is_any_file_error || !total_to_upload) {
                onError?.();
                throw new Error(file_error ?? 'Something went wrong!'); // don't start submitting files until all front-end validation checks pass
            }
            // send files
            const uploader_data = await uploader_instance.upload(processed_files[0]);
            return uploader_data;
        } catch (error) {
            setError(error as string);
            // return error;
        }
    }, []);

    return {
        error,
        uploader,
    };
};

export default useFileUploader;
