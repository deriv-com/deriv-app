import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Field, useFormikContext } from 'formik';
import moment from 'moment';
import { TSocketError } from '@deriv/api-v2/types';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { DatePicker, FormField, InlineMessage, WalletText } from '../../../../../../components';
import { ErrorMessage } from './components';
import { TVerifyPersonalDetailsValues } from './types';
import {
    areDetailsVerifiedValidator,
    dateOfBirthValidator,
    firstNameValidator,
    lastNameValidator,
} from './verifyPersonalDetailsValidationSchema';
import './VerifyPersonalDetails.scss';

type TVerifyPersonalDetailsProps = {
    error?: TSocketError<'get_settings'>['error'] | TSocketError<'set_settings'>['error'];
};

const VerifyPersonalDetails: React.FC<TVerifyPersonalDetailsProps> = ({ error }) => {
    const { dirty, errors, setFieldValue, values } = useFormikContext<TVerifyPersonalDetailsValues>();

    const dateDisplayFormat = 'DD-MM-YYYY';

    const handleTNCChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked && dirty && isValid && values.dateOfBirth) {
            setFieldValue('areDetailsVerified', true);
        }
    };

    const handleDateChange = (dateString: string | null) => {
        setFieldValue('dateOfBirth', dateString);
    };

    const isValid = useMemo(
        () => !errors.dateOfBirth && !errors.firstName && !errors.lastName,
        [errors.dateOfBirth, errors.firstName, errors.lastName]
    );

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
                        disabled={values.areDetailsVerified}
                        label='First name*'
                        message='Your first name as in your identity document'
                        name='firstName'
                        showMessage
                        validationSchema={firstNameValidator}
                        width='100%'
                    />
                    <FormField
                        disabled={values.areDetailsVerified}
                        label='Last name*'
                        message='Your last name as in your identity document'
                        name='lastName'
                        showMessage
                        validationSchema={lastNameValidator}
                        width='100%'
                    />
                    <DatePicker
                        disabled={values.areDetailsVerified}
                        displayFormat={dateDisplayFormat}
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
                    name='areDetailsVerified'
                    onClick={handleTNCChecked}
                    type='checkbox'
                    validate={areDetailsVerifiedValidator}
                />
                <label htmlFor='idv-checkbox'>
                    <WalletText lineHeight='2xs' size='sm'>
                        I confirm that the name and date of birth above match my chosen identity document
                    </WalletText>
                </label>
            </div>
            {error && <ErrorMessage error={error?.code} />}
        </div>
    );
};

export default VerifyPersonalDetails;
