import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import TableCell from './table-cell.jsx';
import TableRowInfo from './table-row-info.jsx';

type TableRowProps = {
    className: string;
    columns: unknown;
    id: number;
    is_footer: boolean;
    is_header: boolean;
    passthrough: unknown;
    replace: unknown;
    row_obj: unknown;
    to: string;
    content_loader: unknown;
    measure: () => void;
};

const TableRow = ({
    className,
    columns,
    content_loader,
    getActionColumns,
    id,
    is_footer,
    is_header,
    passthrough,
    replace,
    row_obj = {},
    show_preloader = false,
    to,
    measure,
    is_dynamic_height,
}: TableRowProps) => {
    const action_columns = getActionColumns && getActionColumns({ row_obj, is_header, is_footer });

    const cells = columns.map(({ col_index, renderCellContent, title, key }) => {
        let cell_content = title;
        if (!is_header) {
            const cell_value = row_obj[col_index] || '';
            cell_content = renderCellContent
                ? renderCellContent({ cell_value, col_index, row_obj, is_footer, passthrough })
                : cell_value;
        }
        return (
            <TableCell col_index={col_index} key={key || col_index}>
                {cell_content}
            </TableCell>
        );
    });

    const row_class_name = classNames(
        'table__row',
        { 'table__row-link': to || replace },
        { [`${className}__row`]: className }
    );
    const ContentLoader = content_loader;
    if (!is_footer && !is_header && show_preloader) {
        return <div className='table__row--preloader'>{content_loader ? <ContentLoader /> : null}</div>;
    }
    return to ? (
        <div className={`${className}__row_wrapper`}>
            <NavLink
                id={`dt_reports_contract_${id}`}
                className={row_class_name}
                to={{
                    pathname: to,
                    state: {
                        from_table_row: true,
                    },
                }}
            >
                {cells}
            </NavLink>
            {action_columns}
        </div>
    ) : (
        <div className={`${className}__row_wrapper`}>
            <TableRowInfo
                className={row_class_name}
                cells={cells}
                replace={replace}
                is_footer={is_footer}
                is_dynamic_height={is_dynamic_height}
                measure={measure}
            />
            {action_columns}
        </div>
    );
};

export default TableRow;
