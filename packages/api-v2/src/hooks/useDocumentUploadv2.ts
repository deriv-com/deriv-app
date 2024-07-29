import { useAPIContext } from '../APIProvider';
import { compressImageFile, generateChunks, numToUint8Array, readFile } from '../utils';
import { TSocketError, TSocketRequestPayload, TSocketResponse } from '../../types';
import md5 from 'md5';

type TDocumentUploadRequest = TSocketRequestPayload<'document_upload'>;
type TDocumentUploadRequestPayload = TDocumentUploadRequest['payload'] & { file?: File };
type TDocumentUploadResponse = TSocketResponse<'document_upload'> & TSocketError<'document_upload'>;

type TFileInfo = {
    fileBuffer: Uint8Array;
    fileType: File['type'];
};

const REQ_TIMEOUT = 20000;

const useDocumentUpload = () => {
    const { wsClient, connection } = useAPIContext();
    /** Request id of the initial document_upload call */
    let reqId: number,
        /** Upload id received from BE for the particular file which is appended to every chunk uploaded */
        uploadId: number,
        /** Timeout reference for removing ws eventListener */
        timeout: NodeJS.Timeout;

    const getFileInfo = async (payload: TDocumentUploadRequestPayload): Promise<TFileInfo> => {
        if (!payload.file) return Promise.reject(new Error('No file selected'));

        const file = payload.file;
        delete payload.file;

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

        return wsClient.request('document_upload', updatedPayload) as Promise<TDocumentUploadResponse>;
    };

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

    const fileUploader = async (fileBuffer: TFileInfo['fileBuffer'], response: TDocumentUploadResponse) => {
        return new Promise((resolve, reject) => {
            timeout = setTimeout(() => {
                wsClient.ws?.removeEventListener('message', handleUploadStatus);
                Promise.reject(new Error(`Request timeout for document_upload`));
            }, REQ_TIMEOUT);

            const handleUploadStatus = (messageEvent: MessageEvent) => {
                const data = JSON.parse(messageEvent.data) as TDocumentUploadResponse;

                if (data.req_id !== reqId && data.document_upload?.upload_id !== uploadId) {
                    return;
                }

                if (data.document_upload?.status === 'failure') {
                    wsClient.ws?.removeEventListener('message', handleUploadStatus);
                    clearTimeout(timeout);
                    reject(data.document_upload);
                    return;
                }

                wsClient.ws?.removeEventListener('message', handleUploadStatus);
                clearTimeout(timeout);
                resolve(data.document_upload);
            };

            wsClient.ws?.addEventListener('message', handleUploadStatus);

            if (response.req_id && response.document_upload?.upload_id) {
                reqId = response.req_id;
                uploadId = response.document_upload?.upload_id;
            }

            sendFile(fileBuffer, response);
        });
    };

    const upload = async (payload: TDocumentUploadRequestPayload) => {
        const fileInfo = await getFileInfo(payload);
        const handshakeResponse = await handshake(fileInfo, payload);
        if (handshakeResponse.error) {
            return Promise.reject(handshakeResponse.error);
        }
        const x = await fileUploader(fileInfo.fileBuffer, handshakeResponse);
        return Promise.resolve(x);
    };

    return { upload };
};

export default useDocumentUpload;
