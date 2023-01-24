import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

const SpanButton: React.FC<Partial<TSpanButtonProps>> = ({
    blue,
    children,
    className = '',
    green,
    has_effect,
    is_button_toggle,
    is_circle,
    is_circular,
    is_plus,
    large,
    medium,
    onClick,
    rounded,
    text,
    primary,
    primary_light,
    secondary,
    alternate,
    transparent,
    small,
    tertiary,
}) => {
    const classes = classNames(
        'dc-btn',
        {
            'dc-btn__effect': has_effect,
            'dc-btn--primary': primary,
            'dc-btn--blue': blue,
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
            'dc-btn--circular': is_circular,
            'dc-btn--transparent': transparent,
        },
        className
    );

    return (
        <span className={classes} onClick={onClick}>
            {text && (
                <Text size='xs' weight='bold' align='center' className={'dc-btn__text'}>
                    {text[0].toUpperCase() + text.substr(1)}
                </Text>
            )}
            {!text && children && (
                <Text size='xs' weight='bold' align='center' className={'dc-btn__text'}>
                    {children}
                </Text>
            )}
        </span>
    );
};

type TSpanButtonProps = React.PropsWithChildren<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
> & {
    className?: string;
    alternate: boolean;
    blue: boolean;
    green: boolean;
    has_effect: boolean;
    is_button_toggle: boolean;
    is_circular: boolean;
    is_circle: boolean;
    is_disabled: boolean;
    is_loading: boolean;
    is_plus: boolean;
    is_submit_success: boolean;
    large: boolean;
    medium: boolean;
    primary: boolean;
    primary_light: boolean;
    rounded: boolean;
    secondary: boolean;
    small: boolean;
    tertiary: boolean;
    text: string;
    transparent: boolean;
};

export default SpanButton;
