import React from 'react';
import classNames from 'classnames';
import { isVanillaContract } from '@deriv/shared';

const DataListCell = ({ className, column, is_footer, passthrough, row }) => {
    if (!column) return null;
    const { col_index, title } = column;
    const cell_value = row[col_index];
    const is_vanilla = isVanillaContract(row.contract_info?.contract_type);
    return (
        <div className={classNames(className, column.col_index)}>
            {!is_footer && (
                <div className={classNames(`${column.col_index}__row-title`, 'data-list__row-title')}>
                    {column.renderHeader ? column.renderHeader({ title, is_vanilla }) : title}
                </div>
            )}
            <div className='data-list__row-content'>
                {column.renderCellContent
                    ? column.renderCellContent({ cell_value, is_footer, passthrough, row_obj: row, is_vanilla })
                    : cell_value}
            </div>
        </div>
    );
};

export default React.memo(DataListCell);
