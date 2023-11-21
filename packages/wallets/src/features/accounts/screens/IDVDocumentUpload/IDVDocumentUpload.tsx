import React, { useMemo, useState } from 'react';
import { FlowTextField, useFlow, WalletDropdown, WalletText } from '../../../../components';
import { drivingLicenseValidator, passportValidator, requiredValidator, ssnitValidator } from '../../validations';
import { IDVDocumentUploadDetails } from './components';
import './IDVDocumentUpload.scss';

const IDVDocumentUpload = () => {
    const { setFormValues } = useFlow();

    const [selectedDocument, setSelectedDocument] = useState('documentNumber');

    const validationSchema = useMemo(() => {
        switch (selectedDocument) {
            case 'driverLicense':
                return drivingLicenseValidator;
            case 'passport':
                return passportValidator;
            case 'ssnit':
                return ssnitValidator;
            default:
                return requiredValidator;
        }
    }, [selectedDocument]);

    return (
        <div className='wallets-idv-document-upload'>
            <div className='wallets-idv-document-upload__body'>
                <div className='wallets-idv-document-upload__title'>
                    <WalletText weight='bold'>Identity verification</WalletText>
                </div>
                <WalletDropdown
                    label='Choose the document type'
                    list={[
                        { text: 'Drivers License', value: 'driverLicense' },
                        { text: 'Passport', value: 'passport' },
                        { text: 'Social Security and National Insurance Trust (SSNIT)', value: 'ssnit' },
                    ]}
                    name='documentType'
                    onSelect={selectedItem => {
                        setSelectedDocument(selectedItem);
                        setFormValues('documentType', selectedItem);
                    }}
                    value={undefined}
                />
                <FlowTextField
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
