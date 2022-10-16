import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon/icon';

const HintBox = ({ className, icon, is_info, is_warn, is_danger, message }) => {
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

HintBox.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    is_info: PropTypes.bool,
    is_warn: PropTypes.bool,
    is_danger: PropTypes.bool,
    message: PropTypes.string,
};

export default HintBox;
