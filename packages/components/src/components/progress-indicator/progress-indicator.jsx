import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const ProgressIndicator = ({ className, value, total, style }) => {
    return (
        <div className={classNames('dc-progress-indicator__container', className)} style={style}>
            <div className={classNames('dc-progress-indicator__bar')} style={{ width: `${(value / total) * 100}%` }} />
            <div className={'dc-progress-indicator__empty'} />
        </div>
    );
};

ProgressIndicator.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    total: PropTypes.number,
    style: PropTypes.object,
};

export default ProgressIndicator;
