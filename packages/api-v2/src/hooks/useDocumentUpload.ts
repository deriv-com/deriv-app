import { useState } from 'react';
import md5 from 'md5';
import { TSocketError, TSocketRequestPayload, TSocketResponse } from '../../types';
import { useAPIContext } from '../APIProvider';
import { compressImageFile, generateChunks, numToUint8Array, readFile } from '../utils';

type TDocumentUploadRequest = TSocketRequestPayload<'document_upload'>;
type TDocumentUploadRequestPayload = Partial<TDocumentUploadRequest['payload']> & { file?: File };
type TDocumentUploadResponse = TSocketResponse<'document_upload'> & TSocketError<'document_upload'>;

type TFileInfo = {
    fileBuffer: Uint8Array;
    fileType: File['type'];
};

export enum DocumentUploadStatus {
    LOADING = 'loading',
    IDLE = 'idle',
    ERROR = 'error',
    SUCCESS = 'success',
}

const REQ_TIMEOUT = 20000;

const useDocumentUpload = () => {
    const { wsClient, connection } = useAPIContext();
    const [status, setStatus] = useState<DocumentUploadStatus>(DocumentUploadStatus.IDLE);

    const getFileInfo = async (file: TDocumentUploadRequestPayload['file']): Promise<TFileInfo> => {
        if (!file) return Promise.reject(new Error('No file selected'));

        const fileType = file.type;
        const fileBlob = await compressImageFile(file);
        const modifiedFile = await readFile(fileBlob);
        // @ts-expect-error type mismatch
        const fileBuffer = new Uint8Array(modifiedFile.buffer);
        return { fileBuffer, fileType };
    };

    /** Perform the initial handshake to get the upload_id from BE */
    const handshake = async ({ fileType, fileBuffer }: TFileInfo, payload: TDocumentUploadRequestPayload) => {
        const checksum = md5(Array.from(fileBuffer));

        const updatedPayload = {
            ...payload,
            document_format: fileType
                .split('/')[1]
                .toLocaleUpperCase() as TDocumentUploadRequestPayload['document_format'],
            expected_checksum: checksum,
            file_size: fileBuffer.length,
            passthrough: {
                document_upload: true,
            },
        };

        try {
            const response = (await wsClient.request(
                'document_upload',
                updatedPayload
            )) as Promise<TDocumentUploadResponse>;
            return response;
        } catch (error) {
            return error as TDocumentUploadResponse;
        }
    };

    /** asynchronously sends file data over WS */
    const sendFile = (fileBuffer: TFileInfo['fileBuffer'], response: TDocumentUploadResponse) => {
        const chunks = generateChunks(fileBuffer, {});
        const id = numToUint8Array(response?.document_upload?.upload_id || 0);
        const type = numToUint8Array(response?.document_upload?.call_type || 0);

        chunks.forEach(chunk => {
            const size = numToUint8Array(chunk.length);
            const payload = new Uint8Array([...type, ...id, ...size, ...chunk]);
            connection?.send(payload);
        });
    };

    /** Initiates file upload and handles the 2nd response received  */
    const fileUploader = async (fileBuffer: TFileInfo['fileBuffer'], response: TDocumentUploadResponse) => {
        /** Request id of the initial document_upload call */
        const reqId = response.req_id;
        /** Upload id received from BE for the particular file which is appended to every chunk uploaded */
        const uploadId = response.document_upload?.upload_id;
        /** Timeout reference for removing WS eventListener */
        let timeout: NodeJS.Timeout;

        return new Promise((resolve, reject) => {
            timeout = setTimeout(() => {
                wsClient.ws?.removeEventListener('message', handleUploadStatus);
                reject(new Error(`Request timeout for document_upload`));
            }, REQ_TIMEOUT);

            const handleUploadStatus = (messageEvent: MessageEvent) => {
                const data = JSON.parse(messageEvent.data) as TDocumentUploadResponse;

                if (data.req_id !== reqId && data.document_upload?.upload_id !== uploadId) {
                    return;
                }
                if (data.error) {
                    wsClient.ws?.removeEventListener('message', handleUploadStatus);
                    clearTimeout(timeout);
                    setStatus(DocumentUploadStatus.ERROR);
                    reject(data);
                    return;
                }

                if (data.document_upload && data.document_upload?.status === 'failure') {
                    wsClient.ws?.removeEventListener('message', handleUploadStatus);

                    clearTimeout(timeout);
                    setStatus(DocumentUploadStatus.ERROR);
                    reject(data);
                    return;
                }

                if (data.document_upload && data.document_upload?.status === 'success') {
                    wsClient.ws?.removeEventListener('message', handleUploadStatus);
                    clearTimeout(timeout);
                    setStatus(DocumentUploadStatus.SUCCESS);
                    resolve(data);
                }
            };

            wsClient.ws?.addEventListener('message', handleUploadStatus);

            sendFile(fileBuffer, response);
        }) as Promise<TDocumentUploadResponse>;
    };

    const upload = async (payload: TDocumentUploadRequestPayload) => {
        setStatus(DocumentUploadStatus.LOADING);
        const { file, ...rest } = payload;
        const fileInfo = await getFileInfo(file);
        const handshakeResponse = await handshake(fileInfo, rest);
        if (handshakeResponse.error) {
            setStatus(DocumentUploadStatus.ERROR);
            return Promise.reject(handshakeResponse);
        }
        const uploadResponse = await fileUploader(fileInfo.fileBuffer, handshakeResponse);
        return Promise.resolve(uploadResponse);
    };

    return {
        upload,
        status,
        resetStatus: setStatus,
    };
};

export default useDocumentUpload;
