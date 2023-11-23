import React, { useMemo } from 'react';
import { usePOI } from '@deriv/api';
import { FlowTextField, useFlow, WalletDropdown, WalletText } from '../../../../components';
import { InlineMessage } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import { statusCodes } from '../../constants';
import { drivingLicenseValidator, passportValidator, requiredValidator, ssnitValidator } from '../../validations';
import { IDVDocumentUploadDetails } from './components';
import './IDVDocumentUpload.scss';

type TErrorMessageProps = Exclude<THooks.POI['current']['status'], undefined>;

const statusMessage: Partial<Record<TErrorMessageProps, string>> = {
    expired: 'Your identity document has expired.',
    rejected: 'We were unable to verify the identity document with the details provided.',
};

// Temporary list of document types till we get the API
const documentTypeList = [
    { text: 'Drivers License', value: 'driverLicense' },
    { text: 'Passport', value: 'passport' },
    { text: 'Social Security and National Insurance Trust (SSNIT)', value: 'ssnit' },
];

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

    const textToValueMapper = documentTypeList.reduce((acc, curr) => {
        acc[curr.text] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    const validationSchema = useMemo(() => {
        const documentType = textToValueMapper[formValues?.documentType];

        switch (documentType) {
            case 'driverLicense':
                return drivingLicenseValidator;
            case 'passport':
                return passportValidator;
            case 'ssnit':
                return ssnitValidator;
            default:
                return requiredValidator;
        }
    }, [formValues?.documentType, textToValueMapper]);

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
                    list={documentTypeList}
                    name='documentType'
                    onChange={inputValue => {
                        setFormValues('documentType', inputValue);
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
