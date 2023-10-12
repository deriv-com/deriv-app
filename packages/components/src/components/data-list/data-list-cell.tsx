import React from 'react';
import classNames from 'classnames';
import { isTurbosContract, isVanillaContract } from '@deriv/shared';
import { TPassThrough, TRow } from '../types/common.types';

export type TColIndex =
    | 'type'
    | 'reference'
    | 'currency'
    | 'purchase'
    | 'payout'
    | 'profit'
    | 'indicative'
    | 'id'
    | 'multiplier'
    | 'buy_price'
    | 'cancellation'
    | 'limit_order'
    | 'bid_price'
    | 'action';

export type TRenderCellContent = {
    cell_value: string;
    is_footer?: boolean;
    passthrough?: TPassThrough;
    row_obj: TRow;
    is_turbos?: boolean;
    is_vanilla?: boolean;
};
export type THeaderProps = {
    title?: React.ReactNode;
    is_vanilla?: boolean;
};

export type TDataListCell = {
    className?: string;
    column?: {
        key?: string;
        title?: string;
        col_index?: TColIndex;
        renderCellContent?: (props: TRenderCellContent) => React.ReactNode;
        renderHeader?: (prop: renderHeaderType) => React.ReactNode;
    };
    is_footer?: boolean;
    passthrough?: TPassThrough;
    row?: TRow;
};

type renderHeaderType = { title?: string; is_vanilla?: boolean };

const DataListCell = ({ className, column, is_footer, passthrough, row }: TDataListCell) => {
    if (!column) return null;
    const { col_index, title } = column;
    const cell_value = row?.[col_index as TColIndex];
    const is_turbos = isTurbosContract(row?.contract_info?.contract_type);
    const is_vanilla = isVanillaContract(row?.contract_info?.contract_type);

    return (
        <div className={classNames(className, column.col_index)}>
            {!is_footer && (
                <div className={classNames(`${column.col_index}__row-title`, 'data-list__row-title')}>
                    {column.renderHeader ? column.renderHeader({ title, is_vanilla }) : title}
                </div>
            )}
            <div className='data-list__row-content'>
                {column.renderCellContent
                    ? column.renderCellContent({
                          cell_value,
                          is_footer,
                          passthrough,
                          row_obj: row as TRow,
                          is_vanilla,
                          is_turbos,
                      })
                    : cell_value}
            </div>
        </div>
    );
};

export default React.memo(DataListCell);
