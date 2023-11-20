import { useCallback, useMemo } from 'react';
import useMutation from '../useMutation';

type TDocumentUploadPayload = Parameters<ReturnType<typeof useMutation<'document_upload'>>['mutate']>[0]['payload'];

/** A custom hook to handle document file uploads to our backend. */
const useDocumentUpload = () => {
    const { data, mutate, ...rest } = useMutation('document_upload');

    const upload = useCallback((payload: TDocumentUploadPayload) => mutate({ payload }), [mutate]);

    const modified_response = useMemo(() => ({ ...data?.document_upload }), [data?.document_upload]);

    return {
        /** The upload response */
        data: modified_response,
        upload,
        ...rest,
    };
};

export default useDocumentUpload;
