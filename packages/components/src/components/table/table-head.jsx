import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Head = ({ children, align, className, fixed }) => (
    <div
        role='columnheader'
        className={classNames('dc-table__head', className, {
            'dc-table__cell--right': align === 'right',
            'dc-table__cell--fixed': fixed,
        })}
    >
        {children}
    </div>
);

Head.propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.node,
    className: PropTypes.string,
    fixed: PropTypes.bool,
};

export default Head;
