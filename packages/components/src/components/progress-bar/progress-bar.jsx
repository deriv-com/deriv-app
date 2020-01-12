import classNames                      from 'classnames';
import PropTypes                       from 'prop-types';
import React                           from 'react';

const ProgressBar = ({
    className,
    danger_limit,
    label,
    value,
    warning_limit,
}) => {
    let status;
    if (value <= danger_limit) {
        status = 'danger';
    } else if (value <= warning_limit) {
        status = 'warning';
    } else {
        status = 'normal';
    }
    return (
            <div className={classNames('dc-progress-bar__container', `dc-progress-bar--${status}`, className)}>
                <p className="dc-progress-bar__label">{label}</p>
                <div
                    className={classNames(
                        'dc-progress-bar__bar',
                    )}
                    style={{
                        width: `${value * 100}%`,
                    }}
                >
                </div>
                <div
                    className={classNames(
                        'dc-progress-bar__empty',
                    )}
                >
                </div>
            </div>
    );
};

ProgressBar.defaultProps = {
    danger_limit : 0.2,
    label        : '',
    value        : 0,
    warning_limit: 0.5,
}

export default ProgressBar;

ProgressBar.propTypes = {
    className    : PropTypes.String,
    danger_limit : PropTypes.Number,
    label        : PropTypes.string,
    value        : PropTypes.number,
    warning_limit: PropTypes.number,
};
