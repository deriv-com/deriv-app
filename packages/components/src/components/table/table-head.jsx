import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Head = ({ children, align }) => {
    return (
        <div
            role='columnheader'
            className={classNames(
                'dc-table__head', {
                    'dc-table__cell--right': align === 'right',
                })}
        >
            {children}
        </div>
    );
};

Head.propTypes = {
    align   : PropTypes.oneOf(['left', 'right']),
    children: PropTypes.node,
};

export default Head;
