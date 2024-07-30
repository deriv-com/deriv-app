import React from 'react';
import { Formik, FormikValues } from 'formik';
import { InlineMessage, Loader, Text } from '@deriv-com/ui';
import { ModalStepWrapper } from '../../../../components';
import { Footer } from '../components';
import { AddressSection, DocumentSubmission, PoaUploadErrorMessage } from './components';
import { usePoa } from './hooks';
import { poaValidationSchema } from './utils';
import './Poa.scss';

type TPoaProps = {
    onCompletion?: VoidFunction;
};

const Poa: React.FC<TPoaProps> = ({ onCompletion }) => {
    const {
        error: errorPoaUpload,
        initialStatus,
        initialValues,
        isLoading,
        isSuccess: isSubmissionSuccess,
        resetError,
        upload,
    } = usePoa();

    if (isLoading) return <Loader />;

    if (isSubmissionSuccess && onCompletion) {
        onCompletion();
    }
    const submit = (values: FormikValues) => {
        upload(values);
    };

    return (
        <Formik
            initialStatus={initialStatus}
            initialValues={initialValues}
            onSubmit={submit}
            validationSchema={poaValidationSchema}
        >
            {({ handleSubmit, isValid, resetForm }) => {
                const onErrorRetry = () => {
                    resetForm();
                    resetError();
                };

                if (errorPoaUpload?.documentUpload) {
                    return (
                        <PoaUploadErrorMessage errorCode={errorPoaUpload.documentUpload.code} onRetry={onErrorRetry} />
                    );
                }

                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disableNext={!isValid} onClickNext={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-poa'>
                            {errorPoaUpload && errorPoaUpload?.addressDetails && (
                                <InlineMessage variant='error'>
                                    <Text>{errorPoaUpload.addressDetails.message}</Text>
                                </InlineMessage>
                            )}
                            <AddressSection />
                            <DocumentSubmission />
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default Poa;
