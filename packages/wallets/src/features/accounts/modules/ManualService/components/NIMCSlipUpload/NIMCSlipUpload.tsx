import React from 'react';
import { Formik } from 'formik';
import { Divider } from '@deriv-com/ui';
import { Dropzone, FormField, WalletText } from '../../../../../../components';
import NIMCSlipFront from '../../../../../../public/images/accounts/nimc-slip-front.svg';
import ProofOfAgeIcon from '../../../../../../public/images/accounts/proof-of-age.svg';
import { NIMCDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { useNIMCUpload } from './hooks';
import { nimcSlipUploadValidator } from './utils';
import './NIMCSlipUpload.scss';

const NIMCSlipUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onCompletion }) => {
    const { error, initialValues, isNIMCUploadSuccess, resetError, submit } = useNIMCUpload(documentIssuingCountryCode);

    if (isNIMCUploadSuccess && onCompletion) {
        onCompletion();
    }

    if (error) {
        return <ManualUploadErrorMessage errorCode={error.code} onRetry={resetError} />;
    }

    return (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={nimcSlipUploadValidator}>
            {({ setFieldValue, values }) => {
                return (
                    <div className='wallets-nimc-slip-document-upload' data-testid='dt_driving-license-document-upload'>
                        <WalletText>First, enter your NIMC slip number.</WalletText>
                        <FormField defaultValue={values.nimcNumber ?? ''} label='NIMC slip number*' name='nimcNumber' />
                        <Divider color='var(--border-divider)' height={2} />
                        <div className='wallets-nimc-slip-document-upload__document-section'>
                            <WalletText>Next, upload both of the following documents.</WalletText>
                            <div className='wallets-nimc-slip-document-upload__dropzones'>
                                <div className='wallets-nimc-slip-document-upload__dropzones--left'>
                                    <Dropzone
                                        buttonText='Drop file or click here to upload'
                                        defaultFile={values.nimcCardFront}
                                        description='Upload your NIMC slip.'
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        icon={<NIMCSlipFront />}
                                        maxSize={8388608}
                                        onFileChange={(file?: File) => setFieldValue('nimcCardFront', file)}
                                    />
                                </div>
                                <div className='wallets-nimc-slip-document-upload__dropzones--right'>
                                    <Dropzone
                                        buttonText='Drop file or click here to upload'
                                        defaultFile={values.nimcCardBack}
                                        description='Upload your proof of age: birth certificate or age declaration document.'
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        icon={<ProofOfAgeIcon />}
                                        maxSize={8388608}
                                        noClick
                                        onFileChange={(file?: File) => setFieldValue('nimcCardBack', file)}
                                    />
                                </div>
                            </div>
                            <DocumentRules hints={NIMCDocumentRules} />
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default NIMCSlipUpload;
