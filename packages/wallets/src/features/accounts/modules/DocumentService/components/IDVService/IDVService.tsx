import React, { useState } from 'react';
import { Formik } from 'formik';
import {
    FormField,
    Loader,
    ModalStepWrapper,
    WalletButton,
    WalletDropdown,
    WalletText,
} from '../../../../../../components';
import { VerifyPersonalDetails } from '../VerifyPersonalDetails';
import { IDVErrorMessage } from './components';
import { getDocumentNumberValidator } from './idvServiceValidators';
import useIDVService from './useIDVService';
import './IDVService.scss';

type TIDVServiceProps = {
    onCompletion?: () => void;
};

const IDVService: React.FC<React.PropsWithChildren<TIDVServiceProps>> = ({ onCompletion }) => {
    const {
        availableDocumentOptions,
        displayedDocumentsList,
        documentExamples,
        errorVerifyPersonalDetails,
        initialFormValues,
        isLoading,
        isSubmitted,
        previousSubmissionErrorStatus,
        submit,
    } = useIDVService();
    const [clientHasDocuments, setClientHasDocuments] = useState<boolean>(true);

    const Footer = ({ disabled, onSubmit }: { disabled?: boolean; onSubmit: () => void }) => {
        return (
            <WalletButton
                disabled={disabled && clientHasDocuments}
                onClick={clientHasDocuments ? onSubmit : onCompletion}
                type='submit'
            >
                Next
            </WalletButton>
        );
    };

    //  If IDV submission is successful, invoke external callback onCompletion()
    if (isSubmitted && onCompletion) {
        onCompletion();
    }

    if (isLoading) return <Loader />;

    return (
        <Formik initialValues={initialFormValues} onSubmit={submit}>
            {({ dirty, handleSubmit, isValid, setFieldValue, values }) => {
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
                    <ModalStepWrapper
                        renderFooter={() => (
                            <Footer disabled={!isValid || !dirty || !values.documentNumber} onSubmit={handleSubmit} />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-idv-service'>
                            <div className='wallets-idv-service__body'>
                                {previousSubmissionErrorStatus && (
                                    <IDVErrorMessage message={previousSubmissionErrorStatus} />
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
                                            message={documentNumberExample ? `Example: ${documentNumberExample}` : ''}
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
                            {clientHasDocuments && <VerifyPersonalDetails error={errorVerifyPersonalDetails} />}
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default IDVService;
