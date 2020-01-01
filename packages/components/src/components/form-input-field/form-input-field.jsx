import React     from 'react';
import { Field } from 'formik';
import Input     from '../input/input.jsx';

const FormInputField = ({ name, optional = false, ...props }) => (
    <Field name={name}>
        {
            ({
                field,
                form: { errors, touched },
            }) => (
                <Input
                    type='text'
                    required={!optional}
                    name={name}
                    autoComplete='off'
                    maxLength='30'
                    error={touched[field.name] && errors[field.name]}
                    {...field}
                    {...props}
                />
            )
        }
    </Field>
);

export default FormInputField;
