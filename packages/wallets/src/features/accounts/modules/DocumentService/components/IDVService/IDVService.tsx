import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Loader } from '@deriv-com/ui';
import { FormDropdown, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import { Footer } from '../../../components';
import {
    TVerifyPersonalDetailsValues,
    useVerifyPersonalDetails,
    VerifyPersonalDetails,
} from '../VerifyPersonalDetails';
import { IDVServiceErrorMessage } from './components';
import { useIDVService } from './hooks';
import { TIDVServiceValues } from './types';
import { documentTypeValidator, getDocumentNumberValidator } from './utils';
import './IDVService.scss';

type TIDVServiceProps = {
    onCompletion?: VoidFunction;
    onDocumentNotAvailable?: VoidFunction;
};

const IDVService: React.FC<React.PropsWithChildren<TIDVServiceProps>> = ({ onCompletion, onDocumentNotAvailable }) => {
    const {
        availableDocumentOptions,
        displayedDocumentsList,
        documentExamples,
        error: errorIDVDetails,
        initialValues: initialIDVValues,
        isLoading: isIDVDataLoading,
        isSubmitted: isIDVSubmitted,
        isSubmitting: isIDVSubmitting,
        previousSubmissionErrorStatus,
        submit: submitIDVDetails,
    } = useIDVService();
    const {
        error: errorPersonalDetails,
        initialValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        isSubmitting: isPersonalDetailsSubmitting,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();
    const [clientHasDocuments, setClientHasDocuments] = useState<boolean>(true);

    const isDataLoading = isIDVDataLoading || isPersonalDetailsDataLoading;
    const isSubmitting = isIDVSubmitting && isPersonalDetailsSubmitting;
    const isSubmitted = isIDVSubmitted && isPersonalDetailsSubmitted;

    const errorMessage = previousSubmissionErrorStatus ?? errorIDVDetails?.code ?? errorPersonalDetails?.code;

    const submit = (values: TIDVServiceValues & TVerifyPersonalDetailsValues) => {
        if (clientHasDocuments) {
            submitPersonalDetails(values);
            submitIDVDetails(values);
        } else if (onDocumentNotAvailable) {
            return onDocumentNotAvailable();
        }
    };

    useEffect(() => {
        //  If IDV submission is successful, invoke external callback onCompletion()
        if (isSubmitted && onCompletion) {
            onCompletion();
        }
    }, [isSubmitted, onCompletion]);

    if (isDataLoading) return <Loader />;

    return (
        <Formik initialValues={{ ...initialIDVValues, ...initialPersonalDetailsValues }} onSubmit={submit}>
            {({ handleSubmit, isValid, values }) => {
                const document = availableDocumentOptions[values.documentType];
                const documentNumberExample =
                    values.documentType &&
                    documentExamples &&
                    documentExamples[values.documentType] &&
                    clientHasDocuments
                        ? documentExamples?.[values.documentType].exampleFormat
                        : '';

                const additionalDocumentNumberExample =
                    values.documentType && clientHasDocuments && documentExamples && document.additional
                        ? documentExamples?.[values.documentType].additionalDocumentExampleFormat
                        : '';

                const disableSubmission = (!isValid && clientHasDocuments) || isSubmitting || !values.documentType;

                const handleSelectDocument = (selectedItem: string) => {
                    setClientHasDocuments(selectedItem !== 'none');
                };

                if (!errorMessage && isSubmitting) {
                    return <Loader />;
                }

                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={disableSubmission} onClickNext={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-idv-service'>
                            <div className='wallets-idv-service__body'>
                                {!!errorMessage && <IDVServiceErrorMessage message={errorMessage} />}
                                <div className='wallets-idv-service__title'>
                                    <WalletText weight='bold'>Identity verification</WalletText>
                                </div>
                                <FormDropdown
                                    errorMessage={'Document type is required'}
                                    isFullWidth
                                    isRequired
                                    label='Choose the document type'
                                    list={displayedDocumentsList}
                                    name='documentType'
                                    onSelect={handleSelectDocument}
                                    validationSchema={documentTypeValidator}
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
                                                clientHasDocuments && document && documentNumberExample
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
                                                    clientHasDocuments &&
                                                    document.additional &&
                                                    additionalDocumentNumberExample
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
                );
            }}
        </Formik>
    );
};

export default IDVService;
