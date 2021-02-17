import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Text from '../text';

function withinZeroAndOne(props, propName, componentName) {
    if (props[propName]) {
        const value = props[propName];
        if (typeof value === 'number') {
            return value >= 0 && value <= 1 ? null : new Error(`${propName} in ${componentName} is not within 0 to 1`);
        }
        return new Error(`${propName} in ${componentName} is not a number`);
    }
    return null;
}

const ProgressBar = ({ className, danger_limit, label, value, warning_limit }) => {
    let status;
    if (value <= danger_limit) {
        status = 'danger';
    } else if (value <= warning_limit) {
        status = 'warning';
    } else {
        status = 'normal';
    }
    return (
        <div className={classNames('dc-progress-bar__container', className)}>
            <Text as='p' color='prominent' align='center' size='xs' weight='bold' className='dc-progress-bar__label'>
                {label}
            </Text>
            <div
                className={classNames(
                    {
                        [`dc-progress-bar--${status}`]: status,
                    },
                    'dc-progress-bar__bar'
                )}
                style={{
                    width: `${value * 100}%`,
                }}
            />
            <div className={classNames(`dc-progress-bar--${status}`, 'dc-progress-bar__empty')} />
        </div>
    );
};

ProgressBar.defaultProps = {
    danger_limit: 0.2,
    label: '',
    value: 0,
    warning_limit: 0.5,
};

export default ProgressBar;

ProgressBar.propTypes = {
    className: PropTypes.string,
    danger_limit: withinZeroAndOne,
    label: PropTypes.string,
    value: withinZeroAndOne,
    warning_limit: withinZeroAndOne,
};
