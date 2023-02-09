import React from 'react';
import classNames from 'classnames';
import Button, { TButtonProps } from '../button/button';

type TFormCancelButton = Partial<TButtonProps> & {
    className?: string;
    is_absolute?: boolean;
    is_center?: boolean;
    is_disabled?: boolean;
    label: string;
    onCancel: () => void;
};

const FormCancelButton = ({
    className,
    is_center = false,
    is_absolute = false,
    label,
    onCancel,
    ...props
}: TFormCancelButton) => {
    return (
        <div
            className={classNames('dc-form-cancel-button', className, {
                'dc-form-cancel-button--absolute': is_absolute,
                'dc-form-cancel-button--center': is_center,
                'dc-form-cancel-button--relative': !is_absolute,
            })}
        >
            <Button has_effect onClick={onCancel} text={label} type='button' tertiary large {...props} />
        </div>
    );
};

export default FormCancelButton;
