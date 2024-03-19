import React, { Fragment } from 'react';
import { Field, FieldProps } from 'formik';
import { useActiveTradingAccount, useGetAccountStatus, useSettings } from '@deriv/api-v2';
import { CountrySelector } from '../../components/CountrySelector';
import { DatePicker } from '../../components/DatePicker';
import { FormInputField } from '../../components/FormFields';

export const PersonalDetails = () => {
    const { data: activeAccount } = useActiveTradingAccount();
    const { data: accountStatus } = useGetAccountStatus();
    const { data: accountSettings } = useSettings();

    const isSocialSignup = accountStatus?.status?.includes('social_signup');
    const isVirtual = activeAccount?.is_virtual;

    const isFieldDisabled = (fieldName: string) => {
        return accountSettings?.immutable_fields?.includes(fieldName);
    };

    return (
        <div className='lg:max-w-[400px] grid pt-8 space-y-12 grid-col-1'>
            {!isVirtual && (
                <Fragment>
                    <div className='lg:flex gap-6'>
                        <FormInputField
                            disabled={isFieldDisabled('first_name')}
                            id='firstName'
                            isFullWidth
                            label='First name*'
                            name='firstName'
                        />
                        <FormInputField
                            disabled={isFieldDisabled('last_name')}
                            isFullWidth
                            label='Last name*'
                            name='lastName'
                        />
                    </div>
                    <Field name='placeOfBirth'>
                        {({ field }: FieldProps<string>) => (
                            <CountrySelector
                                {...field}
                                disabled={isFieldDisabled('place_of_birth')}
                                label='Place of birth'
                                name='placeOfBirth'
                            />
                        )}
                    </Field>
                    <Field name='dateOfBirth' type='input'>
                        {({ field, form, meta }: FieldProps<string>) => (
                            <DatePicker
                                disabled={isFieldDisabled('date_of_birth')}
                                {...field}
                                aria-label='Date of birth*'
                                errorMessage={meta.error}
                                isInvalid={meta.touched && !!meta.error}
                                label='Date of birth*'
                                onDateChange={(date: string | null) => {
                                    form.setFieldValue(field.name, date);
                                }}
                            />
                        )}
                    </Field>
                    <CountrySelector disabled={isFieldDisabled('citizen')} label='Citizenship' name='citizen' />
                </Fragment>
            )}
            <CountrySelector disabled={isFieldDisabled('residence')} label='Country of residence*' name='residence' />
            {isSocialSignup && (
                <FormInputField disabled={isFieldDisabled('email')} isFullWidth label='Email address*' name='email' />
            )}
            {!isVirtual && (
                <FormInputField disabled={isFieldDisabled('phone')} isFullWidth label='Phone*' name='phone' />
            )}
        </div>
    );
};
