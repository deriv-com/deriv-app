import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Field, useFormikContext } from 'formik';
import moment from 'moment';
import { useSettings } from '@deriv/api-v2';
import { DatePicker, FlowTextField, InlineMessage, useFlow, WalletText } from '../../../../../../components';
import SideNote from '../../../../../../public/images/accounts/side-note-example-image.svg';
import unixToDateString from '../../../../../../utils/utils';
import { dateOfBirthValidator, firstNameValidator, lastNameValidator } from '../../../../validations';
import './IDVDocumentUploadDetails.scss';

const IDVDocumentUploadDetails = () => {
    const { data: getSettings } = useSettings();
    const { errors, formValues, setFormValues } = useFlow();
    const { validateForm } = useFormikContext();

    const handleDateChange = (formattedDate: string | null) => {
        setFormValues('dateOfBirth', formattedDate);
    };

    const dateOfBirth = getSettings?.date_of_birth || 0;
    const formattedDateOfBirth = new Date(dateOfBirth * 1000);
    const firstName = getSettings?.first_name;
    const lastName = getSettings?.last_name;

    useEffect(() => {
        setFormValues('firstName', getSettings?.first_name);
        setFormValues('lastName', getSettings?.last_name);
        validateForm();
    }, [getSettings?.first_name, getSettings?.last_name, setFormValues, validateForm]);

    const isValid = useMemo(() => {
        return (
            getSettings?.first_name &&
            getSettings?.last_name &&
            getSettings?.date_of_birth &&
            !(errors.firstName || errors.lastName || errors.dateOfBirth)
        );
    }, [
        errors.dateOfBirth,
        errors.firstName,
        errors.lastName,
        getSettings?.date_of_birth,
        getSettings?.first_name,
        getSettings?.last_name,
    ]);

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
                        defaultValue={firstName}
                        disabled={formValues.verifiedIdvDetails}
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                        validationSchema={firstNameValidator}
                    />

                    <FlowTextField
                        defaultValue={lastName}
                        disabled={formValues.verifiedIdvDetails}
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                        validationSchema={lastNameValidator}
                    />
                    <DatePicker
                        defaultValue={unixToDateString(formattedDateOfBirth)}
                        disabled={formValues.verifiedIdvDetails}
                        label='Date of birth*'
                        maxDate={moment().subtract(18, 'years').toDate()}
                        message='Your date of birth as in your identity document'
                        minDate={moment().subtract(100, 'years').toDate()}
                        mobileAlignment='above'
                        name='dateOfBirth'
                        onDateChange={handleDateChange}
                        showMessage
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
            <div
                className={classNames('wallets-idv-document-details__checkbox', {
                    'wallets-idv-document-details__checkbox--disabled': !isValid,
                })}
            >
                <Field disabled={!isValid} id='idv-checkbox' name='verifiedIdvDetails' type='checkbox' />
                <label htmlFor='idv-checkbox'>
                    <WalletText lineHeight='2xs' size='sm'>
                        I confirm that the name and date of birth above match my chosen identity document
                    </WalletText>
                </label>
            </div>
        </div>
    );
};

export default IDVDocumentUploadDetails;
