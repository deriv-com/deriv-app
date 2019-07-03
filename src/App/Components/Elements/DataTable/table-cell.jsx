import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const TableCell = ({ col_index, children }) => (
    <div className={classNames('table__cell', col_index)}>
        {children}
    </div>
);

TableCell.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]),
    col_index: PropTypes.string,
};

export default TableCell;
