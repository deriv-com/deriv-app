import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Field, useFormikContext } from 'formik';
import moment from 'moment';
import { TSocketError } from '@deriv/api-v2/types';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { DatePicker, FormField, InlineMessage, WalletText } from '../../../../../../components';
import { VerifyPersonalDetailsErrorMessage } from './components';
import { TVerifyPersonalDetailsValues } from './types';
import {
    dateOfBirthValidator,
    firstNameValidator,
    lastNameValidator,
    validateArePersonalDetailsVerified,
} from './utils';
import './VerifyPersonalDetails.scss';

type TVerifyPersonalDetailsProps = {
    error?: TSocketError<'get_settings'>['error'] | TSocketError<'set_settings'>['error'];
    onVerification?: VoidFunction;
};

const VerifyPersonalDetails: React.FC<TVerifyPersonalDetailsProps> = ({ error, onVerification }) => {
    const { errors, setFieldValue, values } = useFormikContext<TVerifyPersonalDetailsValues>();

    const dateDisplayFormat = 'DD-MM-YYYY';

    const isValid = useMemo(
        () => !errors.dateOfBirth && !errors.firstName && !errors.lastName,
        [errors.dateOfBirth, errors.firstName, errors.lastName]
    );

    useEffect(() => {
        if (values.arePersonalDetailsVerified && onVerification) {
            onVerification();
        }
    }, [onVerification, values.arePersonalDetailsVerified]);

    const handleTNCChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue('arePersonalDetailsVerified', event.target.checked);
    };

    return (
        <div className='wallets-verify-personal-details'>
            <InlineMessage>
                <WalletText size='sm'>
                    To avoid delays, enter your <strong>name</strong> and <strong>date of birth</strong> exactly as it
                    appears on your identity document.
                </WalletText>
            </InlineMessage>
            <div className='wallets-verify-personal-details__body'>
                <div className='wallets-verify-personal-details__content'>
                    <FormField
                        disabled={values.arePersonalDetailsVerified}
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                        validationSchema={firstNameValidator}
                        width='100%'
                    />
                    <FormField
                        disabled={values.arePersonalDetailsVerified}
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                        validationSchema={lastNameValidator}
                        width='100%'
                    />
                    <DatePicker
                        disabled={values.arePersonalDetailsVerified}
                        displayFormat={dateDisplayFormat}
                        label='Date of birth*'
                        maxDate={moment().subtract(18, 'years').toDate()}
                        message='Your date of birth as in your identity document'
                        minDate={moment().subtract(100, 'years').toDate()}
                        mobileAlignment='above'
                        name='dateOfBirth'
                        showMessage
                        validationSchema={dateOfBirthValidator}
                    />
                </div>
                <div className='wallets-verify-personal-details__sidenote'>
                    <WalletText size='xs' weight='bold'>
                        Example
                    </WalletText>
                    <DerivLightNameDobPoiIcon height={195} width={288} />
                </div>
            </div>
            <div
                className={classNames('wallets-verify-personal-details__checkbox', {
                    'wallets-verify-personal-details__checkbox--disabled': !isValid,
                })}
            >
                <Field
                    disabled={!isValid}
                    id='idv-checkbox'
                    name='arePersonalDetailsVerified'
                    onClick={handleTNCChecked}
                    type='checkbox'
                    validate={validateArePersonalDetailsVerified}
                />
                <label htmlFor='idv-checkbox'>
                    <WalletText lineHeight='2xs' size='sm'>
                        I confirm that the name and date of birth above match my chosen identity document
                    </WalletText>
                </label>
            </div>
            {error && <VerifyPersonalDetailsErrorMessage error={error?.code} />}
        </div>
    );
};

export default VerifyPersonalDetails;
