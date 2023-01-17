import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';

type THintBox = {
    className?: string;
    icon: string;
    is_info?: boolean;
    is_warn?: boolean;
    is_danger?: boolean;
    message: string | React.ReactElement;
};

const HintBox = ({ className, icon, is_info, is_warn, is_danger, message }: THintBox) => {
    return (
        <div
            className={classNames(
                'dc-hint-box',
                {
                    'dc-hint-box--info': is_info,
                    'dc-hint-box--warn': is_warn,
                    'dc-hint-box--danger': is_danger,
                },
                className
            )}
        >
            <Icon
                className='dc-hint-box__icon'
                custom_color={is_info ? 'var(--status-info)' : undefined}
                icon={icon}
                size={16}
            />
            <div className='dc-hint-box__message'>{message}</div>
        </div>
    );
};

export default HintBox;
