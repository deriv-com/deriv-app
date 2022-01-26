import classNames from 'classnames';
import React from 'react';
import Button from '../button/button.jsx';

type FormCancelButtonProps = {
    className: string;
    is_absolute: boolean;
    is_center: boolean;
    is_disabled: boolean;
    label: string;
    onCancel: () => void;
};

const FormCancelButton = ({
    className,
    form_error,
    is_center,
    is_disabled,
    is_absolute,
    label,
    onCancel,
    ...props
}: FormCancelButtonProps) => {
    return (
        <div
            className={classNames('dc-form-cancel-button', className, {
                'dc-form-cancel-button--absolute': is_absolute,
                'dc-form-cancel-button--center': !!is_center,
                'dc-form-cancel-button--relative': !is_absolute,
            })}
        >
            <Button has_effect onClick={onCancel} text={label} type='button' tertiary large {...props} />
        </div>
    );
};

FormCancelButton.defaultProps = {
    className: undefined,
    is_disabled: false,
    is_center: false,
    is_absolute: false,
};

export default FormCancelButton;
