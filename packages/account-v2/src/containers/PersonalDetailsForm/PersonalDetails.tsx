import React, { Fragment } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { CountrySelector } from '../../components/CountrySelector';
import { DatePicker } from '../../components/DatePicker';
import { FormInputField } from '../../components/FormFields';
import { usePersonalDetails } from '../../hooks/usePersonalDetails';
import { isFieldDisabled } from '../../utils';

export const PersonalDetails = () => {
    const formik = useFormikContext();

    if (!formik) {
        throw new Error('PersonalDetails must be used within a Formik component');
    }
    const { data: accountSettings } = useSettings();
    const { data: personalDetails, isSocialSignup } = usePersonalDetails();

    const { isVirtual } = personalDetails;

    return (
        <div className='lg:max-w-[400px] grid pt-8 space-y-12 grid-col-1'>
            {!isVirtual && (
                <Fragment>
                    <div className='lg:flex gap-6'>
                        <FormInputField
                            disabled={isFieldDisabled(accountSettings, 'first_name')}
                            isFullWidth
                            label='First name*'
                            name='firstName'
                        />
                        <FormInputField
                            disabled={isFieldDisabled(accountSettings, 'last_name')}
                            isFullWidth
                            label='Last name*'
                            name='lastName'
                        />
                    </div>
                    <Field name='placeOfBirth'>
                        {({ field }: FieldProps<string>) => (
                            <CountrySelector
                                {...field}
                                disabled={isFieldDisabled(accountSettings, 'place_of_birth')}
                                label='Place of birth'
                                name='placeOfBirth'
                            />
                        )}
                    </Field>
                    <Field name='dateOfBirth' type='input'>
                        {({ field, form, meta }: FieldProps<string>) => (
                            <DatePicker
                                disabled={isFieldDisabled(accountSettings, 'date_of_birth')}
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
                    <CountrySelector
                        disabled={isFieldDisabled(accountSettings, 'citizen')}
                        label='Citizenship'
                        name='citizen'
                    />
                </Fragment>
            )}
            <CountrySelector
                disabled={isFieldDisabled(accountSettings, 'residence')}
                label='Country of residence*'
                name='residence'
            />
            {isSocialSignup && (
                <FormInputField
                    disabled={isFieldDisabled(accountSettings, 'email')}
                    isFullWidth
                    label='Email address*'
                    name='email'
                />
            )}
            {!isVirtual && (
                <FormInputField
                    disabled={isFieldDisabled(accountSettings, 'phone')}
                    isFullWidth
                    label='Phone*'
                    name='phoneNumber'
                />
            )}
        </div>
    );
};
