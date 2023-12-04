import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { usePOI, useResidenceList, useSettings } from '@deriv/api';
import { FlowTextField, useFlow, WalletDropdown, WalletText } from '../../../../components';
import { InlineMessage } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import { statusCodes } from '../../constants';
import { requiredValidator } from '../../validations';
import { IDVDocumentUploadDetails } from './components';
import './IDVDocumentUpload.scss';

type TErrorMessageProps = Exclude<THooks.POI['current']['status'], undefined>;

const statusMessage: Partial<Record<TErrorMessageProps, string>> = {
    expired: 'Your identity document has expired.',
    rejected: 'We were unable to verify the identity document with the details provided.',
};

const documentTypeToExampleMapper: Record<string, string> = {
    drivers_license: 'B1234567',
    passport: 'G1234567',
    ssnit: 'C123456789012',
};

type TDocumentTypeItem = {
    pattern?: string;
    text: string;
    value: string;
};

const ErrorMessage: React.FC<{ status: TErrorMessageProps }> = ({ status }) => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-idv-document-upload__error'>
            <WalletText weight='bold'>Your identity verification failed because:</WalletText>
            <InlineMessage message={statusMessage[status]} size={isMobile ? 'md' : 'sm'} type='error' />
            <WalletText size='sm'>
                Let&apos;s try again. Choose another document and enter the corresponding details.
            </WalletText>
        </div>
    );
};

const IDVDocumentUpload = () => {
    const { data: poiStatus } = usePOI();
    const { formValues, setFormValues } = useFlow();
    const { data: residenceList, isSuccess: isResidenceListSuccess } = useResidenceList();
    const { data: settings } = useSettings();

    const [documentsDropdownList, documentsMapper, textToValueMapper] = useMemo(() => {
        const documents: Record<string, TDocumentTypeItem> = {};
        const textToValueMapping: Record<string, string> = {};
        const list: TDocumentTypeItem[] = [];
        if (isResidenceListSuccess) {
            const residence = residenceList.filter(residence => residence.value === settings.citizen)[0];
            if (residence) {
                const supportedDocuments = residence.identity?.services?.idv?.documents_supported || {};
                Object.keys(supportedDocuments).forEach(document => {
                    const text = supportedDocuments[document].display_name || '';
                    const value = document;
                    documents[document] = {
                        pattern: supportedDocuments[document].format,
                        text,
                        value,
                    };
                    list.push({
                        text,
                        value: document,
                    });
                    if (!(text in textToValueMapping)) textToValueMapping[text] = value;
                });
            }
        }
        return [list, documents, textToValueMapping];
    }, [isResidenceListSuccess, residenceList, settings.citizen]);

    const validationSchema = useMemo(() => {
        const documentTypeValue = formValues?.documentType;
        const document = documentsMapper[documentTypeValue];

        if (document && document.pattern) {
            let pattern;
            try {
                pattern = new RegExp(document.pattern);
            } catch (err) {
                const match = document.pattern.match(/(\(\?i\))/);
                if (match) {
                    // Passport pattern has (?i) which is not supported in RegExp
                    // Replace the (?i) flag with the 'i' flag
                    const patternWithoutFlag = document.pattern.replace(/(\(\?i\))/, '');
                    pattern = new RegExp(patternWithoutFlag, 'i');
                }
            }

            if (pattern)
                return Yup.string()
                    .matches(
                        pattern,
                        `Please enter the correct format. ${
                            documentTypeValue in documentTypeToExampleMapper
                                ? `Example: ${documentTypeToExampleMapper[documentTypeValue]}`
                                : ''
                        }`
                    )
                    .required(`Please enter your ${document.text} number.`);
        }

        return requiredValidator;
    }, [documentsMapper, formValues?.documentType]);

    const status = poiStatus?.current.status;

    const negativeStatuses = status === statusCodes.expired || status === statusCodes.rejected;

    return (
        <div className='wallets-idv-document-upload'>
            <div className='wallets-idv-document-upload__body'>
                {negativeStatuses && <ErrorMessage status={status} />}
                <div className='wallets-idv-document-upload__title'>
                    <WalletText weight='bold'>Identity verification</WalletText>
                </div>
                <WalletDropdown
                    errorMessage={'Document type is required'}
                    isRequired
                    label='Choose the document type'
                    list={documentsDropdownList}
                    name='documentType'
                    onChange={inputValue => {
                        setFormValues('documentType', textToValueMapper[inputValue]);
                    }}
                    onSelect={selectedItem => {
                        setFormValues('documentType', selectedItem);
                    }}
                    value={formValues?.documentType}
                    variant='comboBox'
                />
                <FlowTextField
                    disabled={!formValues.documentType}
                    label='Enter your document number'
                    name='documentNumber'
                    validationSchema={validationSchema}
                />
                <div className='wallets-idv-document-upload__title'>
                    <WalletText weight='bold'>Details</WalletText>
                </div>
                <IDVDocumentUploadDetails />
            </div>
        </div>
    );
};

export default IDVDocumentUpload;
