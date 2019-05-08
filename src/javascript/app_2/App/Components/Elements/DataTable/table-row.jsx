import classNames  from 'classnames';
import PropTypes   from 'prop-types';
import React       from 'react';
import { NavLink } from 'react-router-dom';
import TableCell   from './table-cell.jsx';

const TableRow = ({
    className,
    columns,
    is_footer,
    is_header,
    row_obj = {},
    to,
}) => {
    const cells = columns.map(({ col_index, renderCellContent, title }) => {
        let cell_content = title;
        if (!is_header) {
            const cell_value = row_obj[col_index] || '';
            cell_content = renderCellContent
                ? renderCellContent({ cell_value, col_index, row_obj, is_footer })
                : cell_value;
        }

        return (
            <TableCell col_index={col_index} key={col_index}>
                {cell_content}
            </TableCell>
        );
    });

    const row_class_name = classNames('table__row', { 'table__row-link': to }, { [`${className}__row`]: className });

    return (
        to ?
            <NavLink className={row_class_name} to={to}>
                {cells}
            </NavLink>
            :
            <div className={row_class_name}>
                {cells}
            </div>
    );
};

TableRow.propTypes = {
    className: PropTypes.string,
    columns  : PropTypes.array,
    is_footer: PropTypes.bool,
    is_header: PropTypes.bool,
    row_obj  : PropTypes.object,
    to       : PropTypes.string,
};

export default TableRow;
