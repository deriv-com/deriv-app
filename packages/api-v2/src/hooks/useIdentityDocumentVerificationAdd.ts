import { useCallback } from 'react';
import useMutation from '../useMutation';

type TIdentityVerificationDocumentAddPayload = Parameters<
    ReturnType<typeof useMutation<'identity_verification_document_add'>>['mutate']
>[0]['payload'];

/** A custom hook to submit IDV details for POI verification.
 *
 * Use cases:
 * - To submit IDV verification for verification flow in Wallets.
 */
const useIdentityDocumentVerificationAdd = () => {
    const { mutate: _mutate, ...rest } = useMutation('identity_verification_document_add');

    const submitIDVDocuments = useCallback(
        (payload: TIdentityVerificationDocumentAddPayload) =>
            _mutate({
                payload,
            }),
        [_mutate]
    );

    return {
        /** Call this function upon IDV submission.
         *
         * @param payload - The payload to pass in which these fields are required:
         * - document_number: The document number passed in by the user
         * - document_type: The type of document in which the document_number is based on. Examples are either drivers_license, passport, ssnit, etc depending on the issuing country.
         *                  These document types can often be retrieved from the `useResidenceList` hook
         * - issuing_country: The country in which the documents are issued and supported.
         */
        submitIDVDocuments,
        /** The original mutate function returned by useMutation */
        _mutate,
        ...rest,
    };
};

export default useIdentityDocumentVerificationAdd;
