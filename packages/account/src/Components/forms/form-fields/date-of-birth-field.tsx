import React from 'react';
import { Field, FieldInputProps, FormikHelpers, FormikState } from 'formik';
import { DateOfBirthPicker, TDatePickerOnChangeEvent } from '@deriv/components';
import { toMoment } from '@deriv/shared';

type TDateOfBirthFieldProps = {
    name: string;
    portal_id: string;
} & Omit<React.ComponentProps<typeof DateOfBirthPicker>, 'onBlur' | 'onChange' | 'error'>;

type TDateOfBirthFieldHelpers = {
    field: FieldInputProps<string | moment.Moment>;
    form: FormikHelpers<{ date_of_birth: string | moment.Moment }> &
        FormikState<{ date_of_birth: string | moment.Moment }>;
};

/**
 * DateOfBirthField is a wrapper around DateOfBirthPicker that can be used with Formik.
 * @name DateOfBirthField
 * @param name - Name of the field
 * @param portal_id - Portal ID
 * @param [props] - Other props to pass to DateOfBirthPicker
 * @returns {React.ReactNode}
 */
const DateOfBirthField = ({ name, portal_id, ...rest }: TDateOfBirthFieldProps) => (
    <Field name={name}>
        {({
            field: { value },
            form: { setFieldValue, errors, touched, setFieldTouched },
        }: TDateOfBirthFieldHelpers) => (
            <DateOfBirthPicker
                {...rest}
                error={touched.date_of_birth && errors.date_of_birth ? errors.date_of_birth : undefined}
                name={name}
                onBlur={() => setFieldTouched(name)}
                onChange={({ target }: TDatePickerOnChangeEvent) =>
                    setFieldValue(name, target?.value ? toMoment(target.value).format('YYYY-MM-DD') : '', true)
                }
                value={value}
                portal_id={portal_id}
            />
        )}
    </Field>
);

export default DateOfBirthField;
