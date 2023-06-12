import React from 'react';
import { Field, FieldProps } from 'formik';
import { Icon, Input, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TFormValues, TInputBaseFields, TInputCommonFields } from '../quick-strategy.types';
import { TDataFields } from './data/data-fields';
import { TDataUniqInput } from './data/data-uniq-input-obj';
import { TInputFieldProps } from './components.types';
import { data_fields } from '.';

const InputField = ({
    idx,
    handleChange,
    onChangeInputValue,
    setCurrentFocus,
    is_mobile,
    field_name,
    id,
    className,
    label,
    input_value,
    placeholder,
    is_uniq_strategy_field,
    trailing_icon_message,
    zIndex,
    uniq_selected_input,
    errors,
}: TInputFieldProps) => {
    const dataField = () => {
        if (is_uniq_strategy_field) {
            return uniq_selected_input;
        }
        return idx ? data_fields[idx] : {};
    };

    const {
        field_name: new_field_name,
        id: new_id,
        className: new_className,
        label: new_label,
        input_value: new_input_value,
        placeholder: new_placeholder,
        trailing_icon_message: new_trailing_icon_message,
        zIndex: new_zIndex,
    } = (dataField() as TDataUniqInput | TDataFields) || {};

    return (
        <Field name={field_name || new_field_name} key={id || new_id} id={id || new_id}>
            {({ field }: FieldProps<string, TFormValues>) => {
                return (
                    <Input
                        {...field}
                        className={className || new_className}
                        type='text'
                        error={errors[(field.name as keyof typeof errors) || (new_field_name as keyof typeof errors)]}
                        label={localize(label || new_label)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            onChangeInputValue(
                                input_value
                                    ? (input_value as TInputBaseFields)
                                    : (new_input_value as TInputCommonFields),
                                e
                            );
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => setCurrentFocus(e.currentTarget.name)}
                        onBlur={() => setCurrentFocus(null)}
                        placeholder={placeholder || new_placeholder}
                        trailing_icon={
                            <Popover
                                alignment={is_mobile ? 'top' : 'bottom'}
                                message={localize(trailing_icon_message || new_trailing_icon_message)}
                                zIndex={zIndex || new_zIndex}
                            >
                                <Icon icon='IcInfoOutline' />
                            </Popover>
                        }
                    />
                );
            }}
        </Field>
    );
};

export default React.memo(InputField);
