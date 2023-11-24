import { useCallback } from 'react';
import useMutation from '../useMutation';

/** A custom hook to send notification event to backend about Onfido successful documents uploaded */
const useIdentityDocumentVerificationAdd = () => {
    const { mutate: _mutate, ...rest } = useMutation('identity_verification_document_add');

    const mutate = useCallback(
        (document_number: string, document_type: string, issuing_country: string, document_additional?: string) =>
            _mutate({
                payload: {
                    document_number,
                    document_type,
                    issuing_country,
                    document_additional,
                },
            }),
        [_mutate]
    );

    return {
        mutate,
        ...rest,
    };
};

export default useIdentityDocumentVerificationAdd;
