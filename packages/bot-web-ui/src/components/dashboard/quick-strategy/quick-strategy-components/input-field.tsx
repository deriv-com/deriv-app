import React from 'react';
import { Field, FieldProps } from 'formik';
import { Icon, Input, Popover } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { TFormValues, TInputBaseFields } from '../quick-strategy.types';
import { TInputFieldProps } from './components.types';

const InputField = ({
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
    trailing_icon_message,
    zIndex,
    errors,
}: TInputFieldProps) => {
    return (
        <Field name={field_name} key={id} id={id}>
            {({ field }: FieldProps<string, TFormValues>) => {
                return (
                    <Input
                        {...field}
                        className={className}
                        type='text'
                        error={errors[(field.name as keyof typeof errors) || (field_name as keyof typeof errors)]}
                        label={localize(label || '')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChange(e);
                            onChangeInputValue(input_value as TInputBaseFields, e);
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => setCurrentFocus(e.currentTarget.name)}
                        onBlur={() => setCurrentFocus(null)}
                        placeholder={placeholder}
                        trailing_icon={
                            <Popover
                                alignment={is_mobile ? 'top' : 'bottom'}
                                message={<Localize i18n_default_text={trailing_icon_message} />}
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

export default React.memo(InputField);
