import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Row = ({ children, className, has_hover }) => {
    const columns_in_row = React.Children.toArray(children).length; // toArray doesn't count null as a child
    let columns_flex = '';

    React.Children.forEach(children, element => {
        if (!React.isValidElement(element)) return;

        const { flex } = element.props;
        columns_flex += `${flex || '1fr'} `;
    });

    return (
        <div
            role='row'
            className={classNames('dc-table__row', className, {
                'dc-table__row--hover': has_hover,
            })}
            style={{
                gridTemplateColumns: columns_flex !== '' ? columns_flex : `repeat(${columns_in_row}, 1fr)`,
            }}
        >
            {children}
        </div>
    );
};

Row.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    has_hover: PropTypes.bool,
};

export default Row;
