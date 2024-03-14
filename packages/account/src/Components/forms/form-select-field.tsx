import { Autocomplete, SelectNative } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Field, FieldProps, FormikErrors } from 'formik';
import React from 'react';
import { TGetField, TListItem } from '../additional-kyc-info-modal/form-config';

type TFormSelectField = TGetField & {
    onItemSelection?: (item: TListItem) => void;
    list_height?: string;
};

type TSetFieldValue = (
    field: string,
    value: string,
    shouldValidate?: boolean
) => Promise<void | FormikErrors<Record<string, string>>>;

const FormSelectField: React.FC<TFormSelectField> = ({
    label,
    name,
    required = false,
    disabled = false,
    list_items,
    onItemSelection,
    placeholder,
    list_height,
}) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const onSelect =
        (field: string, setFieldValue: TSetFieldValue) =>
        ({ value, text }: TListItem) => {
            setFieldValue(field, (value && text) ?? '', true);
        };
    // TODO: remove the following ts-expect-error comments once the issue is fixed within the components
    return (
        <Field name={name}>
            {({ field, meta: { touched, error }, form: { setFieldValue } }: FieldProps<string>) => (
                <React.Fragment>
                    {is_mobile ? (
                        <SelectNative
                            {...field}
                            // @ts-expect-error This needs to fixed in SelectNative component
                            list_items={list_items}
                            // @ts-expect-error This needs to fixed in SelectNative component
                            label={label}
                            required={required}
                            disabled={disabled}
                            error={touched ? error : undefined}
                            use_text
                            data-testid={`dt_${field.name}`}
                        />
                    ) : (
                        <Autocomplete
                            {...field}
                            disabled={disabled}
                            label={label}
                            // @ts-expect-error This needs to fixed in AutoComplete component
                            list_items={list_items}
                            placeholder={placeholder}
                            required={required}
                            data-lpignore='true'
                            autoComplete='off' // prevent chrome autocomplete
                            error={touched ? error : undefined}
                            // @ts-expect-error This needs to fixed in AutoComplete component
                            onItemSelection={onItemSelection ?? onSelect(field.name, setFieldValue)}
                            data-testid={`dt_${field.name}`}
                            // @ts-expect-error This needs to fixed in AutoComplete component
                            list_height={list_height}
                        />
                    )}
                </React.Fragment>
            )}
        </Field>
    );
};

export default FormSelectField;
