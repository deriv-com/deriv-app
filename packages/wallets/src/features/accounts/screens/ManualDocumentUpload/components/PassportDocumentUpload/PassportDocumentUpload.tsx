import React, { useCallback, useState } from 'react';
import { useDocumentUpload, useSettings } from '@deriv/api';
import { Dropzone } from '../../../../../../components';
import { Divider, WalletText, WalletTextField } from '../../../../../../components/Base';
import PassportPlaceholder from '../../../../../../public/images/accounts/passport-placeholder.svg';
import Calendar from '../../../../../../public/images/calendar.svg';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './PassportDocumentUpload.scss';

type TDocumentUploadPayload = Parameters<ReturnType<typeof useDocumentUpload>['upload']>[0];

const PassportDocumentUpload = () => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [passportNumber, setPassportNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const { upload } = useDocumentUpload();
    const { data } = useSettings();

    // this is example how to use useDocumentUpload hook
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const handleUpload = useCallback(() => {
        if (file) {
            upload({
                document_format: file.type
                    .split('/')[1]
                    .toLocaleUpperCase() as TDocumentUploadPayload['document_format'],
                document_id: passportNumber,
                document_issuing_country: data?.country_code ?? undefined,
                document_type: 'passport',
                expiration_date: expirationDate,
                file,
            });
        }
    }, [data?.country_code, expirationDate, file, passportNumber, upload]);

    return (
        <div className='wallets-passport-document-upload' data-testid='dt_passport-document-upload'>
            <WalletText>First, enter your Passport number and the expiry date.</WalletText>
            <div className='wallets-passport-document-upload__input-group'>
                <WalletTextField label='Passport number*' onChange={e => setPassportNumber(e.target.value)} />
                <WalletTextField
                    label='Expiry date*'
                    onChange={e => setExpirationDate(e.target.value)}
                    renderRightIcon={() => <Calendar />}
                    type='date'
                />
            </div>
            <Divider />
            <div className='wallets-passport-document-upload__document-section'>
                <WalletText>Next, upload the page of your passport that contains your photo.</WalletText>
                <Dropzone
                    buttonText='Drop file or click here to upload'
                    description='Upload the page of your passport that contains your photo.'
                    fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                    icon={<PassportPlaceholder />}
                    maxSize={8388608}
                    onFileChange={setFile}
                />
                <DocumentRuleHints docType='passport' />
            </div>
        </div>
    );
};

export default PassportDocumentUpload;
