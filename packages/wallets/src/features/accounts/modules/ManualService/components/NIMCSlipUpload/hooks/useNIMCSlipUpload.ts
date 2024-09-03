import { useCallback } from 'react';
import { FormikValues } from 'formik';
import { DocumentUploadStatus, useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues, useSelfieUpload } from '../../SelfieUpload';

type TNIMCSlipUploadValues = TSelfieUploadValues & {
    nimcCardBack?: File;
    nimcCardFront?: File;
    nimcNumber: string;
};

const useNIMCSlipUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { resetStatus: resetNIMCUploadStatus, status: nimcUploadStatus, upload: uploadNIMC } = useDocumentUpload();
    const {
        initialValues: initialValuesSelfieUpload,
        resetStatus: resetSelfieUploadStatus,
        status: selfieUploadStatus,
        upload: uploadSelfie,
    } = useSelfieUpload(documentIssuingCountryCode);

    const isError =
        nimcUploadStatus === DocumentUploadStatus.ERROR || selfieUploadStatus === DocumentUploadStatus.ERROR;
    const isLoading =
        ((nimcUploadStatus === DocumentUploadStatus.LOADING && selfieUploadStatus === DocumentUploadStatus.IDLE) ||
            selfieUploadStatus === DocumentUploadStatus.LOADING) &&
        !isError;
    const isSuccess =
        !isError &&
        !isLoading &&
        nimcUploadStatus === DocumentUploadStatus.SUCCESS &&
        selfieUploadStatus === DocumentUploadStatus.SUCCESS;

    const initialValues = {
        ...initialValuesSelfieUpload,
        nimcNumber: '',
    } as TNIMCSlipUploadValues;

    const resetUploadStatus = () => {
        resetNIMCUploadStatus(DocumentUploadStatus.IDLE);
        resetSelfieUploadStatus(DocumentUploadStatus.IDLE);
    };

    const uploadFront = useCallback(
        (values: FormikValues | TNIMCSlipUploadValues) => {
            return uploadNIMC({
                document_id: values.nimcNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'nimc_slip',
                file: values.nimcCardFront,
                lifetime_valid: 1,
                page_type: 'front',
            });
        },
        [documentIssuingCountryCode, uploadNIMC]
    );

    const uploadBack = useCallback(
        (values: FormikValues | TNIMCSlipUploadValues) => {
            return uploadNIMC({
                document_id: values.nimcNumber,
                document_issuing_country: documentIssuingCountryCode ?? undefined,
                document_type: 'nimc_slip',
                file: values.nimcCardBack,
                lifetime_valid: 1,
                page_type: 'back',
            });
        },
        [documentIssuingCountryCode, uploadNIMC]
    );

    const upload = useCallback(
        async (values: FormikValues | TNIMCSlipUploadValues) => {
            try {
                await uploadFront(values);
                await uploadBack(values);
                await uploadSelfie(values, values.nimcNumber);

                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        [uploadBack, uploadFront, uploadSelfie]
    );

    return {
        /** initial values for the nimc-slip and selfie forms */
        initialValues,

        /** `true` when nimc-slip/selfie upload encounter error */
        isError,

        /** `true` when nimc-slip/selfie are uploading */
        isLoading,

        /** `true` when nimc-slip/selfie are uploaded successfully */
        isSuccess,

        /** Reset upload statuses for nimc-slip and selfie */
        resetUploadStatus,

        /** upload nimc-slip and selfie files synchronously */
        upload,
    };
};

export default useNIMCSlipUpload;
