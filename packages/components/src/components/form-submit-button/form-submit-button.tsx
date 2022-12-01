import React from 'react';
import classNames from 'classnames';
import Button from '../button/button';
import Text from '../text';

type FormSubmitButton = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className: string;
    has_cancel: boolean;
    is_absolute: boolean;
    is_center: boolean;
    is_disabled: boolean;
    label: string;
    cancel_label: string;
    form_error: string;
    cancel_icon: React.ReactElement;
    is_loading: boolean;
    onCancel: () => void;
};

const FormSubmitButton = ({
    cancel_label,
    className,
    has_cancel = false,
    form_error = '',
    cancel_icon,
    is_center = false,
    is_disabled = false,
    is_absolute = false,
    is_loading,
    label,
    onCancel,
    ...props
}: Partial<FormSubmitButton>) => {
    return (
        <div
            className={classNames('dc-form-submit-button', className, {
                'dc-form-submit-button--absolute': is_absolute,
                'dc-form-submit-button--center': !!is_center,
                'dc-form-submit-button--relative': !is_absolute,
            })}
        >
            {!!form_error && (
                <Text
                    as='p'
                    size='xs'
                    styles={{ color: 'var(--brand-red-coral)' }}
                    className='dc-form-submit-button--error'
                >
                    {form_error}
                </Text>
            )}
            {has_cancel && (
                <Button
                    has_effect
                    onClick={onCancel}
                    text={cancel_label}
                    type='button'
                    secondary
                    large
                    icon={cancel_icon}
                />
            )}
            <Button
                has_effect
                is_disabled={is_disabled}
                type='submit'
                text={label}
                is_loading={is_loading}
                large
                primary
                {...props}
            />
        </div>
    );
};

export default FormSubmitButton;
