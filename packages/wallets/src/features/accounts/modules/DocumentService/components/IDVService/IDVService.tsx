import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { Loader } from '@deriv-com/ui';
import { FormField, ModalStepWrapper, WalletButton, WalletDropdown, WalletText } from '../../../../../../components';
import {
    TVerifyPersonalDetailsValues,
    useVerifyPersonalDetails,
    VerifyPersonalDetails,
} from '../VerifyPersonalDetails';
import { ErrorMessage } from './components';
import { useIDVService } from './hooks';
import { TIDVServiceValues } from './types';
import { getDocumentNumberValidator } from './utils';
import './IDVService.scss';

type TIDVServiceProps = {
    onCompletion?: () => void;
};

const IDVService: React.FC<React.PropsWithChildren<TIDVServiceProps>> = ({ onCompletion }) => {
    const {
        availableDocumentOptions,
        displayedDocumentsList,
        documentExamples,
        error: errorIDVDetails,
        initialFormValues: initialIDVValues,
        isLoading: isIDVDataLoading,
        isSubmitted: isIDVDetailsSubmitted,
        previousSubmissionErrorStatus,
        submit: submitIDVDetails,
    } = useIDVService();
    const {
        error: errorPersonalDetails,
        initialFormValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();
    const [clientHasDocuments, setClientHasDocuments] = useState<boolean>(true);

    const Footer = ({ disabled }: { disabled?: boolean }) => {
        return (
            <WalletButton disabled={disabled && clientHasDocuments} type='submit'>
                Next
            </WalletButton>
        );
    };

    const onSubmit = (values: TIDVServiceValues & TVerifyPersonalDetailsValues) => {
        submitPersonalDetails(values);
        submitIDVDetails(values);
    };

    //  If IDV submission is successful, invoke external callback onCompletion()
    if (isIDVDetailsSubmitted && isPersonalDetailsSubmitted && onCompletion) {
        onCompletion();
    }

    if (isIDVDataLoading || isPersonalDetailsDataLoading) return <Loader />;

    if (errorIDVDetails) {
        // Handle IDV error screen
    }

    return (
        <Formik initialValues={{ ...initialIDVValues, ...initialPersonalDetailsValues }} onSubmit={onSubmit}>
            {({ dirty, isValid, setFieldValue, values }) => {
                const document = availableDocumentOptions[values.documentType];
                const documentNumberExample =
                    values.documentType && clientHasDocuments
                        ? documentExamples?.[values.documentType].exampleFormat
                        : '';
                const additionalDocumentNumberExample =
                    values.documentType && clientHasDocuments
                        ? documentExamples?.[values.documentType].additionalDocumentExampleFormat
                        : '';

                return (
                    <Form>
                        <ModalStepWrapper
                            renderFooter={() => <Footer disabled={!isValid || !dirty || !values.documentNumber} />}
                            title='Add a real MT5 account'
                        >
                            <div className='wallets-idv-service'>
                                <div className='wallets-idv-service__body'>
                                    {previousSubmissionErrorStatus && (
                                        <ErrorMessage message={previousSubmissionErrorStatus} />
                                    )}
                                    <div className='wallets-idv-service__title'>
                                        <WalletText weight='bold'>Identity verification</WalletText>
                                    </div>
                                    <WalletDropdown
                                        errorMessage={'Document type is required'}
                                        isRequired
                                        label='Choose the document type'
                                        list={displayedDocumentsList}
                                        name='documentType'
                                        onSelect={selectedItem => {
                                            setFieldValue('documentType', selectedItem);
                                            setClientHasDocuments(selectedItem !== 'none');
                                        }}
                                        value={values?.documentType}
                                        variant='comboBox'
                                    />
                                    {clientHasDocuments && (
                                        <>
                                            <FormField
                                                disabled={!values.documentType}
                                                label='Enter your document number'
                                                message={
                                                    documentNumberExample ? `Example: ${documentNumberExample}` : ''
                                                }
                                                name='documentNumber'
                                                showMessage={!!values.documentType}
                                                validationSchema={
                                                    document && documentNumberExample
                                                        ? getDocumentNumberValidator(document, documentNumberExample)
                                                        : undefined
                                                }
                                            />
                                            {document && document.additional && (
                                                <FormField
                                                    disabled={!values.documentType}
                                                    label={`Enter your ${document.additional?.value ?? ''} number`}
                                                    message={
                                                        additionalDocumentNumberExample
                                                            ? `Example: ${additionalDocumentNumberExample}`
                                                            : ''
                                                    }
                                                    name='additionalDocumentNumber'
                                                    showMessage={!!values.documentType}
                                                    validationSchema={
                                                        document.additional && additionalDocumentNumberExample
                                                            ? getDocumentNumberValidator(
                                                                  document.additional,
                                                                  additionalDocumentNumberExample
                                                              )
                                                            : undefined
                                                    }
                                                />
                                            )}
                                            <div className='wallets-idv-service__title'>
                                                <WalletText weight='bold'>Details</WalletText>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {clientHasDocuments && <VerifyPersonalDetails error={errorPersonalDetails} />}
                            </div>
                        </ModalStepWrapper>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default IDVService;
