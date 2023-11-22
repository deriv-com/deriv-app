import React from 'react';
import { useSettings } from '@deriv/api';
import { FlowTextField, InlineMessage, WalletText } from '../../../../../../components';
import SideNote from '../../../../../../public/images/accounts/side-note-example-image.svg';
import unixToDateString from '../../../../utils';
import { dateOfBirthValidator, firstNameValidator, lastNameValidator } from '../../../../validations';
import './IDVDocumentUploadDetails.scss';

const IDVDocumentUploadDetails = () => {
    const { data: getSettings } = useSettings();

    const dateOfBirth = getSettings?.date_of_birth || 0;

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
                    <FlowTextField
                        defaultValue={getSettings?.first_name}
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                        validationSchema={firstNameValidator}
                    />

                    <FlowTextField
                        defaultValue={getSettings?.last_name}
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                        validationSchema={lastNameValidator}
                    />
                    {/* TODO: Replace with DatePicker component*/}
                    <FlowTextField
                        defaultValue={unixToDateString(dateOfBirth)}
                        label='Date of birth*'
                        message='Your date of birth as in your identity document'
                        name='dateOfBirth'
                        showMessage
                        type='date'
                        validationSchema={dateOfBirthValidator}
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
