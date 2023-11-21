import React from 'react';
import { usePOI } from '@deriv/api';
import { FlowTextField, WalletDropdown, WalletText } from '../../../../components';
import { InlineMessage } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import { IDVDocumentUploadDetails } from './components';
import './IDVDocumentUpload.scss';

type TErrorMessageProps = THooks.POI['current']['status'];

const statusMessage = {
    expired: 'Your identity document has expired.',
    rejected: 'We were unable to verify the identity document with the details provided.',
} as const;

const ErrorMessage: React.FC<{ status: TErrorMessageProps }> = ({ status }) => {
    const { isMobile } = useDevice();
    return (
        <div className='wallets-idv-document-upload__error'>
            <WalletText weight='bold'>Your identity verification failed because:</WalletText>
            <InlineMessage
                message={statusMessage[status as keyof typeof statusMessage]}
                size={isMobile ? 'md' : 'sm'}
                type='error'
            />
            <WalletText size='sm'>
                Let&apos;s try again. Choose another document and enter the corresponding details.
            </WalletText>
        </div>
    );
};

const IDVDocumentUpload = () => {
    const { data: poiStatus } = usePOI();

    const status = poiStatus?.current.status;

    const negativeStatuses = status === 'expired' || status === 'rejected';

    return (
        <div className='wallets-idv-document-upload'>
            <div className='wallets-idv-document-upload__body'>
                {negativeStatuses && <ErrorMessage status={status} />}
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
