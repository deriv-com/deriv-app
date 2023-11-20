import { useCallback, useEffect, useMemo, useState } from 'react';
import useMutation from '../useMutation';
import { compressImageFile, generateChunks, numToUint8Array, combineBuffer, readFile } from '../utils';
import md5 from 'md5';
import { getWebsocket } from '../APIProvider';

type TDocumentUploadPayload = Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>[0]['payload'];
type TMutatePayload = TDocumentUploadPayload & {
    file?: File;
};

/** A custom hook to handle document file uploads to our backend. */
const useDocumentUpload = () => {
    const { data, mutate, ...rest } = useMutation('document_upload');
    const [tempChunks, setTempChunks] = useState<Uint8Array[]>([]);
    const derivAPI = getWebsocket();

    const sendChunks = useCallback(
        (chunks: Uint8Array[]) => {
            const id = numToUint8Array(data?.document_upload?.upload_id || 0);
            const type = numToUint8Array(data?.document_upload?.call_type || 0);

            chunks.map(chunk => {
                const size = numToUint8Array(chunk.length);
                let payload = new Uint8Array([]);

                payload = combineBuffer(payload, type);
                payload = combineBuffer(payload, id);
                payload = combineBuffer(payload, size);
                payload = combineBuffer(payload, chunk);
                derivAPI?.send(payload);
            });
        },
        [data, derivAPI]
    );

    const upload = useCallback(
        async (payload: TMutatePayload) => {
            if (!payload?.file) return Promise.reject(new Error('No file selected'));
            const file = payload.file;
            delete payload.file;
            const fileBlob = await compressImageFile(file);
            const modifiedFile = await readFile(fileBlob);
            // @ts-expect-error type mismatch
            const fileBuffer = new Uint8Array(modifiedFile.buffer);
            const checksum = md5(Array.from(fileBuffer));

            const updatedPayload = {
                ...payload,
                expected_checksum: checksum,
                file_size: fileBuffer.length,
                passthrough: {
                    document_upload: true,
                },
            };
            const chunks = generateChunks(fileBuffer, { chunkSize: 16384 });
            setTempChunks(chunks);
            await mutate({ payload: updatedPayload });
        },
        [mutate]
    );

    useEffect(() => {
        if (rest.status === 'success' && tempChunks.length && data) {
            sendChunks(tempChunks);
            setTempChunks([]);
        }
    }, [data, rest.status, sendChunks, tempChunks]);

    const modified_response = useMemo(() => ({ ...data?.document_upload }), [data?.document_upload]);

    return {
        /** The upload response */
        data: modified_response,
        /** Function to upload the document */
        upload,
        ...rest,
    };
};

export default useDocumentUpload;
