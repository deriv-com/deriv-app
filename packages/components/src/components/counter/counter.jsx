import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const Counter = ({ className, count }) => {
    return <div className={classNames('dc-counter', className)}>{count}</div>;
};

Counter.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
};

export default Counter;
