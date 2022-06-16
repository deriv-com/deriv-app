import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon/icon.jsx';

const HintBox = ({ className, icon, is_info, is_warn, message }) => {
    return (
        <div
            className={classNames('dc-hint-box', {
                'dc-hint-box--info': is_info,
                'dc-hint-box--warn': is_warn,
                className: !!className,
            })}
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
};

export default HintBox;
