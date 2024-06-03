import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Field, useFormikContext } from 'formik';
import moment from 'moment';
import { useSettings } from '@deriv/api-v2';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { DatePicker, FlowTextField, InlineMessage, useFlow, WalletText } from '../../../../components';
import unixToDateString from '../../../../utils/utils';
import { dateOfBirthValidator, firstNameValidator, lastNameValidator } from '../../validations';
import './VerifyDocumentDetails.scss';

const VerifyDocumentDetails = () => {
    const { data: getSettings, update } = useSettings();
    const { currentScreenId, formValues, setFormValues } = useFlow();
    const { isValid, validateForm } = useFormikContext();

    const isOnfido = currentScreenId === 'onfidoScreen';

    const dateOfBirth = getSettings?.date_of_birth ?? 0;
    const formattedDateOfBirth = new Date(dateOfBirth * 1000);
    const firstName = getSettings?.first_name;
    const lastName = getSettings?.last_name;

    const isFormDirty =
        formValues.firstName !== getSettings.first_name ||
        formValues.lastName !== getSettings.last_name ||
        formValues.dateOfBirth !== unixToDateString(new Date(dateOfBirth * 1000));

    useEffect(() => {
        setFormValues('firstName', getSettings?.first_name);
        setFormValues('lastName', getSettings?.last_name);
        validateForm();
    }, [getSettings?.first_name, getSettings?.last_name, setFormValues, validateForm]);

    const handleDateChange = (formattedDate: string | null) => {
        setFormValues('dateOfBirth', formattedDate);
    };

    const handleTNCChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && isFormDirty && isOnfido && isValid) {
            update({
                date_of_birth: formValues.dateOfBirth,
                first_name: formValues.firstName,
                last_name: formValues.lastName,
            });
        }
    };

    if (formValues.verifiedDocumentDetails && isOnfido)
        return (
            <div
                className='wallets-verify-document-details__placeholder'
                data-testid='dt_wallets_verify_document_details__placeholder'
            />
        );

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
                        autoFocus={isOnfido}
                        defaultValue={firstName}
                        disabled={formValues.verifiedDocumentDetails}
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                        validationSchema={firstNameValidator}
                        width='100%'
                    />
                    <FlowTextField
                        defaultValue={lastName}
                        disabled={formValues.verifiedDocumentDetails}
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                        validationSchema={lastNameValidator}
                        width='100%'
                    />
                    <DatePicker
                        defaultValue={unixToDateString(formattedDateOfBirth)}
                        disabled={formValues.verifiedDocumentDetails}
                        displayFormat='DD-MM-YYYY'
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
                    <DerivLightNameDobPoiIcon height={195} width={288} />
                </div>
            </div>
            <div
                className={classNames('wallets-verify-document-details__checkbox', {
                    'wallets-verify-document-details__checkbox--disabled': !isValid,
                })}
            >
                <Field
                    disabled={!isValid}
                    id='idv-checkbox'
                    name='verifiedDocumentDetails'
                    onClick={handleTNCChecked}
                    type='checkbox'
                />
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
