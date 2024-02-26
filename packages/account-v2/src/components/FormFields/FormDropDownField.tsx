import React, { ComponentProps } from 'react';
import { Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useBreakpoint } from '@deriv/quill-design';
import { Dropdown } from '@deriv-com/ui';
import { validateField } from '../../utils/validation';

type FormDropDownFieldProps = Omit<
    ComponentProps<typeof Dropdown>,
    'errorMessage' | 'isRequired' | 'onSelect' | 'variant'
> & {
    name: string;
    validationSchema?: Yup.AnySchema;
};

/**
 * FormDropDownField is a wrapper around Dropdown that can be used with Formik.
 * @name FormDropDownField
 * @param name - Name of the field
 * @param [props] - Other props to pass to Input
 * @returns ReactNode
 */
const FormDropDownField = ({ name, validationSchema, ...rest }: FormDropDownFieldProps) => {
    const { isMobile } = useBreakpoint();

    return (
        <Field name={name} validate={validateField(validationSchema)}>
            {({ field, form, meta: { error, touched } }: FieldProps<string>) => (
                <Dropdown
                    {...field}
                    {...rest}
                    errorMessage={error}
                    isRequired={touched && !!error}
                    onSelect={value => form.setFieldValue(name, value)}
                    variant={isMobile ? 'prompt' : 'comboBox'}
                />
            )}
        </Field>
    );
};

export default FormDropDownField;
