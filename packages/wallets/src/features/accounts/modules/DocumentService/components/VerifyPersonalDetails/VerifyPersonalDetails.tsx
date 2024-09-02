import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Field, useFormikContext } from 'formik';
import moment from 'moment';
import { TSocketError } from '@deriv/api-v2/types';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { DatePicker, FormField, InlineMessage, WalletText } from '../../../../../../components';
import { VerifyPersonalDetailsErrorMessage } from './components';
import { TVerifyPersonalDetailsValues } from './types';
import {
    getDateOfBirthValidator,
    getFirstNameValidator,
    getLastNameValidator,
    getValidateArePersonalDetailsVerified,
} from './utils';
import './VerifyPersonalDetails.scss';

type TVerifyPersonalDetailsProps = {
    error?: TSocketError<'get_settings'>['error'] | TSocketError<'set_settings'>['error'];
    onVerification?: VoidFunction;
};

const VerifyPersonalDetails: React.FC<TVerifyPersonalDetailsProps> = ({ error, onVerification }) => {
    const { localize } = useTranslations();
    const { errors, setFieldValue, values } = useFormikContext<TVerifyPersonalDetailsValues>();

    const dateDisplayFormat = 'DD-MM-YYYY';

    const isValid = !errors.dateOfBirth && !errors.firstName && !errors.lastName;

    useEffect(() => {
        if (values.arePersonalDetailsVerified && onVerification) {
            onVerification();
        }
    }, [onVerification, values.arePersonalDetailsVerified]);

    useEffect(() => {
        if (error) {
            setFieldValue('arePersonalDetailsVerified', false);
        }
    }, [error, setFieldValue]);

    const handleTNCChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue('arePersonalDetailsVerified', event.target.checked);
    };

    return (
        <div className='wallets-verify-personal-details'>
            <InlineMessage>
                <WalletText size='sm'>
                    <Localize
                        components={[<strong key={0} />]}
                        i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as it appears on your identity document.'
                    />
                </WalletText>
            </InlineMessage>
            <div className='wallets-verify-personal-details__body'>
                <div className='wallets-verify-personal-details__content'>
                    <FormField
                        disabled={values.arePersonalDetailsVerified}
                        label={localize('First name*')}
                        message={localize('Your first name as in your identity document')}
                        name='firstName'
                        showMessage
                        validationSchema={getFirstNameValidator(localize)}
                        width='100%'
                    />
                    <FormField
                        disabled={values.arePersonalDetailsVerified}
                        label={localize('Last name*')}
                        message={localize('Your last name as in your identity document')}
                        name='lastName'
                        showMessage
                        validationSchema={getLastNameValidator(localize)}
                        width='100%'
                    />
                    <DatePicker
                        disabled={values.arePersonalDetailsVerified}
                        displayFormat={dateDisplayFormat}
                        label={localize('Date of birth*')}
                        maxDate={moment().subtract(18, 'years').toDate()}
                        message={localize('Your date of birth as in your identity document')}
                        minDate={moment().subtract(100, 'years').toDate()}
                        mobileAlignment='above'
                        name='dateOfBirth'
                        showMessage
                        validationSchema={getDateOfBirthValidator(localize)}
                    />
                </div>
                <div className='wallets-verify-personal-details__sidenote'>
                    <WalletText size='xs' weight='bold'>
                        <Localize i18n_default_text='Example' />
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
                    validate={(values: boolean) => getValidateArePersonalDetailsVerified(values, localize)}
                />
                <label htmlFor='idv-checkbox'>
                    <WalletText lineHeight='2xs' size='sm'>
                        <Localize i18n_default_text='I confirm that the name and date of birth above match my chosen identity document' />
                    </WalletText>
                </label>
            </div>
            {error && <VerifyPersonalDetailsErrorMessage error={error?.code} />}
        </div>
    );
};

export default VerifyPersonalDetails;
