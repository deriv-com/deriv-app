import classNames    from 'classnames';
import PropTypes     from 'prop-types';
import React         from 'react';

const Counter = ({ count, className }) => {
    return (
        <div className={classNames('dc-counter', className)}>
            {count}
        </div>
    );
};

Counter.propTypes = {
    count    : PropTypes.number,
    className: PropTypes.string,
};

export default Counter;
