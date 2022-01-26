import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';

type ButtonProps = {
    children: React.ReactNode;
    className: string;
    icon: string;
    is_disabled: boolean;
    is_hidden: boolean;
    label: string;
    onClick: () => void;
};

const Button = ({ children, className, is_disabled, is_hidden, icon, label, onClick }: ButtonProps) => (
    <>
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
                    <Icon icon={icon} className='dc-calendar__icon' color={is_disabled ? 'disabled' : undefined} />
                )}
                {children}
            </span>
        )}
    </>
);

export default Button;
