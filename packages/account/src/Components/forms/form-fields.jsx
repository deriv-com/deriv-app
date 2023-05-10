import React from 'react';
import { Field } from 'formik';
import { DateOfBirthPicker, Input } from '@deriv/components';
import { toMoment } from '@deriv/shared';

export const DateOfBirthField = props => (
    <Field name={props.name}>
        {({ field: { value }, form: { setFieldValue, errors, touched, setTouched } }) => (
            <DateOfBirthPicker
                error={touched.date_of_birth && errors.date_of_birth}
                onBlur={() =>
                    setTouched({
                        ...touched,
                        date_of_birth: true,
                    })
                }
                onChange={({ target }) =>
                    setFieldValue(
                        'date_of_birth',
                        target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '',
                        true
                    )
                }
                value={value}
                portal_id={props.portal_id}
                {...props}
            />
        )}
    </Field>
);

export const FormInputField = ({ name, optional = false, warn, ...props }) => (
    <Field name={name}>
        {({ field, form: { errors, touched } }) => (
            <Input
                type='text'
                required={!optional}
                name={name}
                autoComplete='off'
                maxLength={props.maxLength || 30}
                error={touched[field.name] && errors[field.name]}
                warn={warn}
                {...field}
                {...props}
            />
        )}
    </Field>
);
