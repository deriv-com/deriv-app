import React from 'react';
import { Field } from 'formik';
import { DateOfBirthPicker, Input } from '@deriv/components';
import { toMoment } from '@deriv/shared';

export const DateOfBirthField = ({ name, portal_id, ...rest }) => (
    <Field name={name}>
        {({ field: { value }, form: { setFieldValue, errors, touched, setFieldTouched } }) => (
            <DateOfBirthPicker
                error={touched.date_of_birth && errors.date_of_birth}
                name={name}
                onBlur={() => setFieldTouched(name)}
                onChange={({ target }) =>
                    setFieldValue(name, target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '', true)
                }
                value={value}
                portal_id={portal_id}
                {...rest}
            />
        )}
    </Field>
);

export const FormInputField = ({ name, warn, ...rest }) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }) => (
            <Input
                type='text'
                autoComplete='off'
                error={touched[field.name] && errors[field.name]}
                warn={warn}
                {...field}
                {...rest}
            />
        )}
    </Field>
);
