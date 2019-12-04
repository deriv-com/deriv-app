import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Cell = ({ children, align = 'left' }) => {
    return (
        <div
            role='cell'
            className={classNames(
                'dc-table__cell', {
                    'dc-table__cell--right': align === 'right',
                })}
        >
            {children}
        </div>
    );
};

Cell.propTypes = {
    align   : PropTypes.oneOf(['left', 'right']),
    children: PropTypes.node,
};

export default Cell;
