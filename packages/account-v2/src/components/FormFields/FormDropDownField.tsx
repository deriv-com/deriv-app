import React, { ComponentProps } from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, useDevice } from '@deriv-com/ui';
import { validateField } from '../../utils/validation';

type FormDropDownFieldProps = Omit<
    ComponentProps<typeof Dropdown>,
    'dropdownIcon' | 'errorMessage' | 'isRequired' | 'name' | 'onSelect' | 'variant'
> & {
    handleSelect?: (value: string) => void;
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
export const FormDropDownField = ({ handleSelect, name, validationSchema, ...rest }: FormDropDownFieldProps) => {
    const { isMobile } = useDevice();
    const formik = useFormikContext();

    if (!formik) {
        throw new Error('FormDropDownField must be used within a Formik component');
    }

    return (
        <Field name={name} validate={validateField(validationSchema)}>
            {({ field, form, meta: { error, touched } }: FieldProps<string>) => (
                <Dropdown
                    {...field}
                    {...rest}
                    aria-label={rest.label}
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage={touched && error ? error : ''}
                    isRequired={touched && !!error}
                    onSearch={field.onChange}
                    onSelect={
                        handleSelect ? value => handleSelect(value as string) : value => form.setFieldValue(name, value)
                    }
                    variant={isMobile ? 'prompt' : 'comboBox'}
                />
            )}
        </Field>
    );
};
