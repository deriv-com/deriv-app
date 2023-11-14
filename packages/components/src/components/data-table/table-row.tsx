import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TTableRowItem } from '../types/common.types';
import TableCell from './table-cell';
import TableRowInfo from './table-row-info';

export type TSource = {
    [key: string]: unknown;
};
type TTableRow<T> = {
    className?: string;
    id?: string;
    is_footer: boolean;
    is_header?: boolean;
    passthrough?: { isTopUp: (item: TSource) => boolean };
    replace?: TTableRowItem;
    to?: string;
    show_preloader?: boolean;
    measure?: () => void;
    is_dynamic_height: boolean;
    row_obj?: T;
    getActionColumns?: (params: { row_obj?: T; is_header?: boolean; is_footer: boolean }) => any;
    content_loader: React.ElementType;
    columns?: any;
};

type TCellContent<U> = {
    cell_value: string;
    col_index: string;
    row_obj?: U;
    is_footer: boolean;
    passthrough: any;
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
}: TTableRow<any>) => {
    const action_columns = getActionColumns && getActionColumns({ row_obj, is_header, is_footer });

    const cells = columns.map(
        ({
            col_index,
            renderCellContent,
            title,
            key,
        }: {
            col_index: string;
            renderCellContent: (params: TCellContent<any>) => any;
            title: string;
            key: string;
        }) => {
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
        }
    );

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
