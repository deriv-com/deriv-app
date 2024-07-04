import { useMemo } from 'react';
import { useIdentityDocumentVerificationAdd, usePOI, useResidenceList, useSettings } from '@deriv/api-v2';
import { statusCodes } from '../../../../constants';
import { TVerifyPersonalDetailsValues, useVerifyPersonalDetails } from '../VerifyPersonalDetails';
import { documentNumberExamples } from './contants';
import { TDocumentTypeItem, TErrorMessageProps, TIDVServiceValues } from './types';

const statusMessage: Partial<Record<TErrorMessageProps, string>> = {
    expired: 'Your identity document has expired.',
    rejected: 'We were unable to verify the identity document with the details provided.',
};

const useIDVService = () => {
    const { data: poiStatus, isLoading: isPOIStatusLoading } = usePOI();
    const {
        data: residenceList,
        isLoading: isResidenceListLoading,
        isSuccess: isResidenceListSuccess,
    } = useResidenceList();
    const { data: settings, isLoading: isSettingsLoading } = useSettings();
    const {
        isLoading: isIDVSubmitting,
        isSuccess: isIDVSubmissionSuccess,
        submitIDVDocuments,
    } = useIdentityDocumentVerificationAdd();
    const {
        initialFormValues: initialPersonalDetailsValues,
        isLoading: isVerifyPersonalDetailsLoading,
        isSubmitted: isPersonalDetailsSubmissionSuccess,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();

    const isLoading =
        isPOIStatusLoading ||
        isResidenceListLoading ||
        isSettingsLoading ||
        isIDVSubmitting ||
        isVerifyPersonalDetailsLoading;

    const [displayedDocumentsList, availableDocumentOptions] = useMemo(() => {
        const documents: Record<string, TDocumentTypeItem> = {};
        const list: TDocumentTypeItem[] = [];
        if (isResidenceListSuccess) {
            const residence = residenceList.filter(residence => residence.value === settings.citizen)[0];
            if (residence) {
                const supportedDocuments = residence.identity?.services?.idv?.documents_supported || {};
                Object.keys(supportedDocuments).forEach(document => {
                    const pattern = supportedDocuments[document].format;
                    const text = supportedDocuments[document].display_name || '';
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
                            text: additional?.display_name || '',
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
            pattern: 'none',
            text: "I don't have any of these",
            value: 'none',
        });
        return [list, documents];
    }, [isResidenceListSuccess, residenceList, settings.citizen]);

    const status = poiStatus?.current.status;

    const previousSubmissionErrorStatus =
        status === statusCodes.expired || status === statusCodes.rejected ? statusMessage[status] : null;

    const submit = (values: TIDVServiceValues & TVerifyPersonalDetailsValues) => {
        submitIDVDocuments({
            document_additional: values.additionalDocumentNumber,
            document_number: values.documentNumber,
            document_type: values.documentType,
            issuing_country: settings.citizen ?? '',
        });
        submitPersonalDetails<TIDVServiceValues>(values);
    };

    const initialFormValues = useMemo<TIDVServiceValues & TVerifyPersonalDetailsValues>(
        () => ({
            documentNumber: '',
            documentType: '',
            ...initialPersonalDetailsValues,
        }),
        [initialPersonalDetailsValues]
    );

    const documentExamples = useMemo(
        () => (!settings.citizen ? undefined : documentNumberExamples[settings.citizen]),
        [settings.citizen]
    );

    const isSubmitted = isIDVSubmissionSuccess || isPersonalDetailsSubmissionSuccess;

    return {
        availableDocumentOptions,
        displayedDocumentsList,
        documentExamples,
        initialFormValues,
        isLoading,
        isSubmitted,
        previousSubmissionErrorStatus,
        submit,
    };
};

export default useIDVService;
