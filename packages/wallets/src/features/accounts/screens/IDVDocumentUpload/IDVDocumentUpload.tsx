import React from 'react';
import { FlowTextField, WalletDropdown, WalletText } from '../../../../components';
import { IDVDocumentUploadDetails } from './components';
import './IDVDocumentUpload.scss';

const IDVDocumentUpload = () => {
    return (
        <div className='wallets-idv-document-upload'>
            <div className='wallets-idv-document-upload__body'>
                <div className='wallets-idv-document-upload__title'>
                    <WalletText weight='bold'>Identity verification</WalletText>
                </div>
                {/* TODO: Update dropdown after Formik is implemented */}
                <WalletDropdown
                    label='Choose the document type'
                    list={[]}
                    name='wallets-idv-document-upload__dropdown'
                    onSelect={() => null}
                    value={undefined}
                />
                <FlowTextField label='Enter your document number' name='documentNumber' />
                <div className='wallets-idv-document-upload__title'>
                    <WalletText weight='bold'>Details</WalletText>
                </div>
                <IDVDocumentUploadDetails />
            </div>
        </div>
    );
};

export default IDVDocumentUpload;
