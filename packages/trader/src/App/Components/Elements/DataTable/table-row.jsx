import classNames   from 'classnames';
import PropTypes    from 'prop-types';
import React        from 'react';
import { NavLink }  from 'react-router-dom';
import TableCell    from './table-cell.jsx';
import TableRowInfo from './table-row-info.jsx';

const TableRow = ({
    className,
    columns,
    is_footer,
    is_header,
    replace,
    row_obj = {},
    to,
}) => {
    const cells = columns.map(({ col_index, renderCellContent, title, key }) => {
        let cell_content = title;
        if (!is_header) {
            const cell_value = row_obj[col_index] || '';
            cell_content = renderCellContent
                ? renderCellContent({ cell_value, col_index, row_obj, is_footer })
                : cell_value;
        }

        return (
            <TableCell col_index={col_index} key={key || col_index}>
                {cell_content}
            </TableCell>
        );
    });

    const row_class_name = classNames('table__row', { 'table__row-link': to || replace }, { [`${className}__row`]: className });

    return (
        to ?
            <NavLink
                className={row_class_name}
                to={{
                    pathname: to,
                    state   : {
                        from_table_row: true,
                    },
                }}
            >
                {cells}
            </NavLink>
            :
            <TableRowInfo
                className={row_class_name}
                cells={cells}
                replace={replace}
                is_footer={is_footer}
            />
    );
};

TableRow.propTypes = {
    className: PropTypes.string,
    columns  : PropTypes.array,
    is_footer: PropTypes.bool,
    is_header: PropTypes.bool,
    replace  : PropTypes.object,
    row_obj  : PropTypes.object,
    to       : PropTypes.string,
};

export default TableRow;
