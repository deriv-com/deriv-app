import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Field, useFormikContext } from 'formik';
import moment from 'moment';
import { useSettings } from '@deriv/api-v2';
import { DerivLightDobPoiIcon } from '@deriv/quill-icons';
import { DatePicker, FlowTextField, InlineMessage, useFlow, WalletText } from '../../../../components';
import unixToDateString from '../../../../utils/utils';
import { dateOfBirthValidator, firstNameValidator, lastNameValidator } from '../../validations';
import './VerifyDocumentDetails.scss';

const VerifyDocumentDetails = () => {
    const { data: getSettings, update } = useSettings();
    const { errors, formValues, setFormValues } = useFlow();
    const { dirty, validateForm } = useFormikContext();

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

    useEffect(() => {
        if (formValues.verifiedDocumentDetails && dirty && isValid) {
            update({
                date_of_birth: formValues.dateOfBirth,
                first_name: formValues.firstName,
                last_name: formValues.lastName,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formValues.dateOfBirth,
        formValues.firstName,
        formValues.lastName,
        formValues.verifiedDocumentDetails,
        getSettings.date_of_birth,
        getSettings.first_name,
        getSettings.last_name,
        isValid,
    ]);

    if (formValues.verifiedDocumentDetails) return <div className='wallets-verify-document-details__dummy' />;

    return (
        <div className='wallets-verify-document-details'>
            <InlineMessage>
                <WalletText size='sm'>
                    To avoid delays, enter your <strong>name</strong> and <strong>date of birth</strong> exactly as it
                    appears on your identity document.
                </WalletText>
            </InlineMessage>
            <div className='wallets-verify-document-details__body'>
                <div className='wallets-verify-document-details__content'>
                    <FlowTextField
                        defaultValue={firstName}
                        disabled={formValues.verifiedDocumentDetails}
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                        validationSchema={firstNameValidator}
                    />
                    <FlowTextField
                        defaultValue={lastName}
                        disabled={formValues.verifiedDocumentDetails}
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                        validationSchema={lastNameValidator}
                    />
                    <DatePicker
                        defaultValue={unixToDateString(formattedDateOfBirth)}
                        disabled={formValues.verifiedDocumentDetails}
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
                <div className='wallets-verify-document-details__sidenote'>
                    <WalletText size='xs' weight='bold'>
                        Example
                    </WalletText>
                    <DerivLightDobPoiIcon height={195} width={288} />
                </div>
            </div>
            <div
                className={classNames('wallets-verify-document-details__checkbox', {
                    'wallets-verify-document-details__checkbox--disabled': !isValid,
                })}
            >
                <Field disabled={!isValid} id='idv-checkbox' name='verifiedDocumentDetails' type='checkbox' />
                <label htmlFor='idv-checkbox'>
                    <WalletText lineHeight='2xs' size='sm'>
                        I confirm that the name and date of birth above match my chosen identity document
                    </WalletText>
                </label>
            </div>
        </div>
    );
};

export default VerifyDocumentDetails;
