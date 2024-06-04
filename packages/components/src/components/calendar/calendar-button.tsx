import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';

type TButtonProps = {
    className?: string;
    icon?: string;
    is_disabled?: boolean;
    is_hidden?: boolean;
    label?: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
    secondary?: boolean;
    small?: boolean;
    text?: string;
};

const Button = ({
    children,
    className,
    is_disabled,
    is_hidden,
    icon,
    label,
    onClick,
}: React.PropsWithChildren<TButtonProps>) => (
    <React.Fragment>
        {!is_hidden && (
            <span
                className={classNames('dc-calendar__btn', className, {
                    'dc-calendar__btn--disabled': is_disabled,
                    'dc-calendar__btn--is-hidden': is_hidden,
                })}
                onClick={onClick}
            >
                {label}
                {icon && (
                    <Icon
                        data_testid={`dt_calendar_icon_${icon}`}
                        icon={icon}
                        className='dc-calendar__icon'
                        color={is_disabled ? 'disabled' : undefined}
                    />
                )}
                {children}
            </span>
        )}
    </React.Fragment>
);

export default Button;
