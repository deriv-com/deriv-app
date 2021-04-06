import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { DatePicker, Input } from '@deriv/components';
import { ROOT_CLASS } from '../constants';

const InputField = ({ data }) => {
    switch (data.type) {
        case 'text':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }) => (
                        <Input
                            {...field}
                            className={`${ROOT_CLASS}__field`}
                            type='text'
                            label={data.label}
                            error={touched[field.name] && errors[field.name]}
                        />
                    )}
                </Field>
            );
        case 'date':
            return (
                <Field name={data.name}>
                    {({ field, form: { errors, touched } }) => (
                        <DatePicker
                            {...field}
                            className={`${ROOT_CLASS}__field`}
                            date_format='YYYY-MM-DD'
                            display_format='DD MMM YYYY'
                            name={data.name}
                            label={data.label}
                            error={touched[field.name] && errors[field.name]}
                            readOnly
                        />
                    )}
                </Field>
            );
        default:
            return null;
    }
};

InputField.propTypes = {
    data: PropTypes.object,
};

export default InputField;
