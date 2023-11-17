import React from 'react';
import { FlowTextField, InlineMessage, WalletText } from '../../../../../../components';
import SideNote from '../../../../../../public/images/accounts/side-note-example-image.svg';
import './IDVDocumentUploadDetails.scss';

const IDVDocumentUploadDetails = () => {
    return (
        <div className='wallets-idv-document-details'>
            <InlineMessage>
                <WalletText size='sm'>
                    To avoid delays, enter your <strong>name</strong> and <strong>date of birth</strong> exactly as it
                    appears on your identity document.
                </WalletText>
            </InlineMessage>
            <div className='wallets-idv-document-details__body'>
                <div className='wallets-idv-document-details__content'>
                    {/* TODO: Update account details using implemented Formik */}

                    <FlowTextField
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                    />

                    <FlowTextField
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                    />
                    {/* TODO: Replace with DatePicker component*/}
                    <FlowTextField
                        label='Date of birth*'
                        message='Your date of birth as in your identity document'
                        name='dateOfBirth'
                        showMessage
                        type='date'
                    />
                </div>
                <div className='wallets-idv-document-details__sidenote'>
                    <WalletText size='xs' weight='bold'>
                        Example
                    </WalletText>
                    <SideNote />
                </div>
            </div>
        </div>
    );
};

export default IDVDocumentUploadDetails;
