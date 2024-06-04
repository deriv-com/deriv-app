import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';

type THintBox = {
    className?: string;
    icon: string;
    is_info?: boolean;
    is_warn?: boolean;
    is_danger?: boolean;
    is_inline?: boolean;
    icon_height?: number;
    icon_width?: number;
    message: string | React.ReactElement;
    id?: string;
};

/** @deprecated use `InlineMessage` instead. */
const HintBox = ({
    className,
    icon,
    is_info,
    is_warn,
    is_danger,
    is_inline,
    icon_height,
    icon_width,
    message,
    id,
}: THintBox) => {
    return (
        <div
            className={classNames(
                'dc-hint-box',
                {
                    'dc-hint-box--info': is_info,
                    'dc-hint-box--warn': is_warn,
                    'dc-hint-box--danger': is_danger,
                    'dc-hint-box--inline': is_inline,
                },
                className
            )}
            id={id}
        >
            <Icon
                className={classNames('dc-hint-box__icon', {
                    'dc-hint-box--inline-icon': is_inline,
                })}
                custom_color={is_info ? 'var(--status-info)' : undefined}
                icon={icon}
                height={icon_height}
                width={icon_width}
                size={icon_height && icon_width ? 0 : 16}
            />
            <div
                className={classNames('dc-hint-box__message', {
                    'dc-hint-box--inline-message': is_inline,
                })}
            >
                {message}
            </div>
        </div>
    );
};

export default HintBox;
