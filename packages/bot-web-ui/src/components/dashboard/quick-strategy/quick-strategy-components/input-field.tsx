import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps } from 'formik';
import { Icon, Input, Popover } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { TFormValues, TInputBaseFields, TInputsFieldNames } from '../quick-strategy.types';
import { TInputs } from './components.types';

const InputField = ({
    field_name,
    id,
    className,
    label,
    placeholder,
    trailing_icon_message,
    zIndex,
    errors,
    handleChange,
    onChangeInputValue,
    setCurrentFocus,
    type,
}: TInputs) => {
    const is_mobile = isMobile();
    return (
        <div
            className={classNames('quick-strategy__form-row', {
                'quick-strategy__form-row--multiple': !is_mobile,
            })}
        >
            <Field name={field_name} key={id} id={id}>
                {({ field }: FieldProps<string, TFormValues>) => {
                    return (
                        <Input
                            {...field}
                            className={className}
                            type={type}
                            error={errors[(field.name as keyof typeof errors) || (field_name as keyof typeof errors)]}
                            label={localize(label || '')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e);
                                onChangeInputValue(field_name as TInputBaseFields, e);
                            }}
                            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                                setCurrentFocus(e.currentTarget.name);
                            }}
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
        </div>
    );
};

InputField.displayName = 'InputField';

export default React.memo(InputField);
