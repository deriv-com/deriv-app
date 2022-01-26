import classNames from 'classnames';
import React from 'react';
import { Button } from '@deriv/components';

type ToggleButtonProps = {
    children: React.ReactNode;
    className: string;
    is_disabled: boolean;
    is_selected: boolean;
    onChange: () => void;
    onClick: () => void;
    value: unknown;
};

const ToggleButton = ({
    children,
    className,
    is_disabled,
    is_selected,
    onChange,
    onClick,
    value,
    ...others
}: ToggleButtonProps) => {
    const handleChange = e => {
        if (onClick) {
            onClick(e, value);
            if (e.isDefaultPrevented()) {
                return;
            }
        }

        if (onChange) {
            onChange(e, value);
        }
    };

    return (
        <Button
            className={classNames('toggle-button', { 'toggle-button--selected': is_selected }, className)}
            is_disabled={is_disabled}
            onClick={handleChange}
            {...others}
        >
            {children}
        </Button>
    );
};

ToggleButton.defaultProps = {
    is_disabled: false,
};

export default ToggleButton;
