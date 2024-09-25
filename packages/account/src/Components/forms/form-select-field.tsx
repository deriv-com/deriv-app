import { FC, Fragment } from 'react';
import { Autocomplete, SelectNative } from '@deriv/components';
import { Field, FieldProps, FormikErrors } from 'formik';
import { TListItem, TGetField } from '../../Types';
import { useDevice } from '@deriv-com/ui';

type TFormSelectField = TGetField & {
    onItemSelection?: (item: TListItem) => void;
    list_height?: string;
};

type TSetFieldValue = (
    field: string,
    value: string,
    shouldValidate?: boolean
) => Promise<void | FormikErrors<Record<string, string>>>;

const FormSelectField: FC<TFormSelectField> = ({
    label,
    name,
    required = false,
    disabled = false,
    list_items,
    onItemSelection,
    placeholder,
    list_height,
}) => {
    const { isDesktop } = useDevice();
    const onSelect =
        (field: string, setFieldValue: TSetFieldValue) =>
        ({ value, text }: TListItem) => {
            setFieldValue(field, (value && text) ?? '', true);
        };
    // TODO: remove the following ts-expect-error comments once the issue is fixed within the components
    return (
        <Field name={name}>
            {({ field, meta: { touched, error }, form: { setFieldValue } }: FieldProps<string>) => (
                <Fragment>
                    {!isDesktop ? (
                        <SelectNative
                            {...field}
                            list_items={list_items}
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
                            // @ts-expect-error This needs to fixed in AutoComplete component
                            label={label}
                            list_items={list_items}
                            placeholder={placeholder}
                            required={required}
                            data-lpignore='true'
                            autoComplete='off' // prevent chrome autocomplete
                            error={touched ? error : undefined}
                            onItemSelection={onItemSelection ?? onSelect(field.name, setFieldValue)}
                            data-testid={`dt_${field.name}`}
                            list_height={list_height}
                        />
                    )}
                </Fragment>
            )}
        </Field>
    );
};

export default FormSelectField;
