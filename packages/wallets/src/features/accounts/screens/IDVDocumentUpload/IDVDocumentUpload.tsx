import React from 'react';
import { WalletDropdown, WalletText, WalletTextField } from '../../../../components';
import { IDVDocumentUploadDetails } from './components';
import './IDVDocumentUpload.scss';

const IDVDocumentUpload = () => {
    return (
        <div className='wallets-idv-document-upload'>
            <div className='wallets-idv-document-upload__title'>
                <WalletText weight='bold'>Identity verification</WalletText>
            </div>
            {/* TODO: Update dropdown after Formik is implemented */}
            <div className='wallets-idv-document-upload__dropdown'>
                <WalletDropdown
                    label='Choose the document type'
                    list={[]}
                    onSelect={() => null}
                    value={undefined}
                    width={68}
                />
            </div>
            <WalletTextField label='Enter your document number' width={68} />
            <div className='wallets-idv-document-upload__title'>
                <WalletText weight='bold'>Details</WalletText>
            </div>
            <IDVDocumentUploadDetails />
        </div>
    );
};

export default IDVDocumentUpload;
