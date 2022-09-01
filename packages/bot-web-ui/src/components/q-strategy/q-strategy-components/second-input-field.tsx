import { Field } from 'formik';
import React from 'react';
import { Icon, Input, Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { data_fields } from '.';

const SecondInputField = ({ idx, handleChange, onChangeInputValue, setCurrentFocus, is_mobile }: any) => {
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
    } = data_fields[idx + 1];
    return (
        <Field name={field_name} key={id}>
            {({ field }) => {
                return (
                    <Input
                        {...field}
                        className={className}
                        label_className={label_className}
                        field_className={field_className}
                        type='text'
                        label={localize(label)}
                        onChange={e => {
                            handleChange(e);
                            onChangeInputValue(input_value, e);
                        }}
                        onFocus={e => setCurrentFocus(e.currentTarget.name)}
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
