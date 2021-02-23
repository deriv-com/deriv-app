import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ButtonLoading from './button_loading.jsx';
import Icon from '../icon';
import Text from '../text';

const ButtonGroup = ({ children, className }) => (
    <div className={classNames('dc-btn__group', className)}>{children}</div>
);
const Button = ({
    blue,
    children,
    className = '',
    classNameSpan,
    green,
    has_effect,
    icon,
    id,
    is_disabled,
    is_loading,
    is_submit_success,
    is_button_toggle,
    is_circle,
    is_plus,
    large,
    medium,
    onClick,
    rounded,
    tabIndex,
    text,
    wrapperClassName,
    type,
    primary,
    primary_light,
    secondary,
    alternate,
    small,
    tertiary,
    renderText,
    ...props
}) => {
    const classes = classNames(
        'dc-btn',
        {
            'dc-btn__effect': has_effect,
            'dc-btn--primary': primary,
            'dc-btn--secondary': secondary,
            'dc-btn--tertiary': tertiary,
            'dc-btn--primary__light': primary_light,
            'dc-btn--primary__blue': blue && primary,
            'dc-btn--tertiary__blue': blue && tertiary,
            'dc-btn--alternate': alternate,
            'dc-btn--green': green,
            'dc-btn__rounded': rounded,
            'dc-btn__large': large,
            'dc-btn__medium': medium,
            'dc-btn__small': small,
            'dc-btn__toggle': is_button_toggle,
            'dc-btn--plus': is_plus,
            'dc-btn--circle': is_circle,
        },
        className
    );
    const button = (
        <button
            id={id}
            className={classes}
            onClick={onClick || undefined}
            disabled={is_disabled}
            tabIndex={tabIndex || '0'}
            type={is_submit_success ? 'button' : type || 'submit'}
            {...props}
        >
            {icon && <div className={classNames('dc-btn__icon', { 'dc-btn__icon--circle': is_circle })}>{icon}</div>}
            {text &&
                !(is_loading || is_submit_success) &&
                ((typeof renderText === 'function' && renderText(text[0].toUpperCase() + text.substr(1))) || (
                    <Text size='xs' weight='bold' align='center' className={classNames('dc-btn__text', classNameSpan)}>
                        {text[0].toUpperCase() + text.substr(1)}
                    </Text>
                ))}
            {is_loading && <ButtonLoading />}
            {is_submit_success && <Icon icon='IcCheckmark' color='active' size={24} />}
            {is_plus && <Icon icon='IcAddBold' color='black' size={18} />}
            {!text && children && (
                <Text size='xs' weight='bold' align='center' className={classNames('dc-btn__text', classNameSpan)}>
                    {children}
                </Text>
            )}
        </button>
    );
    const wrapper = <div className={wrapperClassName}>{button}</div>;

    return wrapperClassName ? wrapper : button;
};

Button.propTypes = {
    blue: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    classNameSpan: PropTypes.string,
    green: PropTypes.bool,
    has_effect: PropTypes.bool,
    icon: PropTypes.node,
    id: PropTypes.string,
    is_disabled: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    is_loading: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    is_circle: PropTypes.bool,
    is_plus: PropTypes.bool,
    is_submit_success: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool,
    onClick: PropTypes.func,
    primary: PropTypes.bool,
    primary_light: PropTypes.bool,
    rounded: PropTypes.bool,
    secondary: PropTypes.bool,
    small: PropTypes.bool,
    tertiary: PropTypes.bool,
    text: PropTypes.string,
    wrapperClassName: PropTypes.string,
};

Button.Group = ButtonGroup;

export default Button;
