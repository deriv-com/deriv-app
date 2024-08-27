import { useMemo } from 'react';
import { FormikValues } from 'formik';
import { useIdentityDocumentVerificationAdd, usePOI, useResidenceList, useSettings } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { TDocumentTypeItem, TErrorMessageProps, TIDVServiceValues } from '../types';
import { documentNumberExamples, statusCodes } from '../utils';

const useIDVService = () => {
    const { localize } = useTranslations();
    const { data: poiStatus, isLoading: isPOIStatusLoading } = usePOI();
    const {
        data: residenceList,
        isLoading: isResidenceListLoading,
        isSuccess: isResidenceListSuccess,
    } = useResidenceList();
    const { data: settings, isLoading: isSettingsLoading } = useSettings();
    const {
        error,
        isLoading: isSubmitting,
        isSuccess: isIDVSubmissionSuccess,
        submitIDVDocuments,
    } = useIdentityDocumentVerificationAdd();

    const isLoading = isPOIStatusLoading || isResidenceListLoading || isSettingsLoading;

    const statusMessage: Partial<Record<TErrorMessageProps, string>> = {
        expired: localize('Your identity document has expired.'),
        rejected: localize('We were unable to verify the identity document with the details provided.'),
    } as const;

    const [displayedDocumentsList, availableDocumentOptions] = useMemo(() => {
        const documents: Record<string, TDocumentTypeItem> = {};
        const list: TDocumentTypeItem[] = [];
        if (isResidenceListSuccess) {
            const residence = residenceList.filter(residence => residence.value === settings.citizen)[0];
            if (residence) {
                const supportedDocuments = residence.identity?.services?.idv?.documents_supported || {};
                Object.keys(supportedDocuments).forEach(document => {
                    const pattern = supportedDocuments[document].format;
                    const text = supportedDocuments[document].display_name
                        ? localize(supportedDocuments[document].display_name as string)
                        : '';
                    const value = document;
                    documents[document] = {
                        pattern,
                        text,
                        value,
                    };
                    if (supportedDocuments[document].additional) {
                        const additional = supportedDocuments[document].additional;
                        documents[document].additional = {
                            pattern: additional?.format,
                            text: additional?.display_name ? localize(additional?.display_name) : '',
                            value: supportedDocuments[document]?.display_name || 'additional document',
                        };
                    }
                    list.push({
                        text,
                        value: document,
                    });
                });
            }
        }

        list.push({
            text: localize("I don't have any of these"),
            value: 'none',
        });
        return [list, documents];
    }, [isResidenceListSuccess, localize, residenceList, settings.citizen]);

    const status = poiStatus?.current.status ?? 'none';

    const previousSubmissionErrorStatus =
        status === statusCodes.expired || status === statusCodes.rejected
            ? { code: status, message: statusMessage[status] }
            : null;

    const submit = (values: FormikValues | TIDVServiceValues) => {
        submitIDVDocuments({
            document_additional: values.additionalDocumentNumber,
            document_number: values.documentNumber,
            document_type: values.documentType,
            issuing_country: settings.citizen ?? '',
        });
    };

    const initialValues = {
        documentNumber: '',
        documentType: '',
    } as TIDVServiceValues;

    const documentExamples = useMemo(
        () => (!settings.citizen ? undefined : documentNumberExamples[settings.citizen]),
        [settings.citizen]
    );

    const isSubmitted = isIDVSubmissionSuccess;

    return {
        /** Contains information of all the available IDV documents in object format */
        availableDocumentOptions,

        /** Contains information of all the available IDV documents in list format for display purpose */
        displayedDocumentsList,

        /** Contains document number examples corresponding to the clients country */
        documentExamples,

        /** Error received (if any) while submitting the documents using `identity_verification_document_add` API call */
        error: error?.error,

        /** Initial Formik values */
        initialValues,

        /** Loading status for initial render of IDV form */
        isLoading,

        /** `true` if submission of IDV details is successful */
        isSubmitted,

        /** `true` if submission is in progress using the `identity_verification_document_add` API call */
        isSubmitting,

        /** Error status shown on upon IDV resubmission (provides the reason for resubmission) */
        previousSubmissionErrorStatus,

        /** Function to initiate IDV details submission */
        submit,
    };
};

export default useIDVService;
