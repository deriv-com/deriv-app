import React from 'react';
import classNames from 'classnames';
import { TButtonProps, TButtonGroupProps } from './types';

const ButtonGroup = ({ children, className }: TButtonGroupProps) => (
    <div className={classNames('dc-btn__group', className)}>{children}</div>
);
const Button = ({
    children,
    className = '',
    classNameSpan,
    has_effect,
    id,
    is_disabled,
    is_loading,
    is_submit_success,
    large,
    medium,
    onClick,
    rounded,
    tabIndex = 0,
    wrapperClassName,
    type,
    primary,
    primary_light,
    secondary,
    transparent,
    small,
    ...props
}: Partial<TButtonProps>) => {
    const classes = classNames(
        'dc-btn',
        {
            'dc-btn__effect': has_effect,
            'dc-btn--primary': primary,
            'dc-btn--secondary': secondary,
            'dc-btn--primary__light': primary_light,
            'dc-btn__rounded': rounded,
            'dc-btn__large': large,
            'dc-btn__medium': medium,
            'dc-btn__small': small,
            'dc-btn--transparent': transparent,
        },
        className
    );
    const button = (
        <button
            id={id}
            className={classes}
            onClick={onClick}
            disabled={is_disabled}
            tabIndex={tabIndex}
            type={is_submit_success ? 'button' : type || 'submit'}
            {...props}
        >
            {is_loading && <p>Loading...</p>}
            <p className={classNames('dc-btn__text', classNameSpan)}>{children}</p>
        </button>
    );
    const wrapper = <div className={wrapperClassName}>{button}</div>;

    return wrapperClassName ? wrapper : button;
};

Button.Group = ButtonGroup;

export default Button;
