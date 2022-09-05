import { Field, FieldProps, FormikProps } from 'formik';
import React from 'react';
import { Icon, Input, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { data_fields } from '.';
import { TDataFields } from './data/data-fields';
import { TFormValues, TOnChangeInputValue, TSetCurrentFocus } from '../q-strategy.types';

type TSecondInputFieldProps = {
    idx: number;
    handleChange: FormikProps<TFormValues>['handleChange'];
    onChangeInputValue: TOnChangeInputValue;
    setCurrentFocus: TSetCurrentFocus;
    is_mobile: boolean;
};

const SecondInputField = ({
    idx,
    handleChange,
    onChangeInputValue,
    setCurrentFocus,
    is_mobile,
}: TSecondInputFieldProps) => {
    const {
        field_name,
        id,
        className,
        label_className,
        field_className,
        label,
        input_value,
        placeholder,
        trailing_icon_message,
        zIndex,
    } = data_fields[idx + 1] as TDataFields;
    return (
        <Field name={field_name} key={id}>
            {({ field }: FieldProps<string, TFormValues>) => {
                return (
                    <Input
                        {...field}
                        className={className}
                        label_className={label_className}
                        field_className={field_className}
                        type='text'
                        label={localize(label)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            onChangeInputValue(input_value, e);
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => setCurrentFocus(e.currentTarget.name)}
                        onBlur={() => setCurrentFocus(null)}
                        placeholder={placeholder}
                        trailing_icon={
                            <Popover
                                alignment={is_mobile ? 'top' : 'bottom'}
                                message={localize(trailing_icon_message)}
                                zIndex={zIndex}
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

export default SecondInputField;
