//TODO
// 1. implement sorting by column (ASC/DESC)
// 2. implement filtering per column
import React from 'react';
import classNames from 'classnames';
import {
    AutoSizer as _AutoSizer,
    List as _List,
    CellMeasurer as _CellMeasurer,
    ListProps,
    AutoSizerProps,
    CellMeasurerCache,
    Grid,
} from 'react-virtualized';
import { isForwardStartingBuyTransaction } from '@deriv/shared';
import TableRow, { TSource } from './table-row';
import ThemedScrollbars from '../themed-scrollbars';
import { TTableRowItem } from '../types/common.types';
import { CellMeasurerProps, MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer.js';

const List = _List as unknown as React.FC<ListProps>;
const AutoSizer = _AutoSizer as unknown as React.FC<AutoSizerProps>;
const CellMeasurer = _CellMeasurer as unknown as React.FC<CellMeasurerProps>;

type TMeasure = {
    measure?: () => void;
};

type TRowRenderer = {
    style: React.CSSProperties;
    index: number;
    key: string;
    parent: MeasuredCellParent;
};

type TDataTable = {
    className: string;
    content_loader: React.ElementType;
    columns: TSource[];
    contract_id?: number;
    getActionColumns?: (params: { row_obj?: TSource; is_header?: boolean; is_footer: boolean }) => TTableRowItem[];
    getRowSize?: ((params: { index: number }) => number) | number;
    measure?: () => void;
    getRowAction?: (item: TSource) => TTableRowItem;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
    id?: number;
    passthrough?: React.ComponentProps<typeof TableRow>['passthrough'];
    autoHide?: boolean;
    footer?: Record<string, unknown> | React.ReactNode;
    preloaderCheck?: (param: TSource) => boolean;
    data_source?: TSource[];
    keyMapper?: (row: TSource) => number | string;
};

const DataTable = ({
    children,
    className,
    columns,
    content_loader,
    data_source,
    footer,
    getActionColumns,
    getRowAction,
    getRowSize,
    id,
    keyMapper,
    onScroll,
    passthrough,
    preloaderCheck,
}: React.PropsWithChildren<TDataTable>) => {
    const cache_ref = React.useRef<CellMeasurerCache>();
    const list_ref = React.useRef<Grid>();
    const is_dynamic_height = !getRowSize;
    const [scroll_top, setScrollTop] = React.useState(0);
    const [is_loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (is_dynamic_height) {
            cache_ref.current = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => {
                    if (data_source && row_index < data_source.length)
                        return keyMapper?.(data_source[row_index]) || row_index;
                    return row_index;
                },
            });
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_dynamic_height) list_ref?.current?.recomputeGridSize({ columnIndex: 0, rowIndex: 0 });
    }, [data_source, is_dynamic_height]);

    const handleScroll = (ev: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollTop((ev.target as HTMLElement).scrollTop);
        if (typeof onScroll === 'function') onScroll(ev);
    };

    const rowRenderer = ({ style, index, key, parent }: TRowRenderer) => {
        let item = data_source?.[index];
        const { action_type, shortcode, purchase_time, transaction_time } = item || {};
        if (
            item &&
            isForwardStartingBuyTransaction(
                action_type as string,
                shortcode as string,
                (purchase_time as number) || (transaction_time as number)
            )
        ) {
            const is_sold = !!data_source?.find(
                transaction => transaction.action_type === 'sell' && transaction.id === item?.id
            );
            item = { ...item, is_sold };
        }
        const contract_id = (item?.contract_id || item?.id) as string;
        let action: TTableRowItem | undefined, row_key;
        if (item) {
            action = getRowAction && getRowAction(item);
            row_key = keyMapper?.(item) || key;
        }

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const getContent = ({ measure }: TMeasure) => (
            <TableRow
                className={className}
                columns={columns}
                content_loader={content_loader}
                getActionColumns={getActionColumns}
                id={contract_id as string}
                key={id}
                measure={measure}
                passthrough={passthrough}
                replace={typeof action === 'object' ? action : undefined}
                row_obj={item}
                show_preloader={typeof preloaderCheck === 'function' && item ? preloaderCheck(item) : false}
                to={typeof action === 'string' ? action : undefined}
                is_dynamic_height={is_dynamic_height}
                is_footer={false}
                is_header={false}
            />
        );

        return is_dynamic_height ? (
            <CellMeasurer
                cache={cache_ref.current as CellMeasurerCache}
                columnIndex={0}
                key={row_key}
                rowIndex={index}
                parent={parent}
            >
                {({ measure }) => <div style={style}>{getContent({ measure })}</div>}
            </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent({})}
            </div>
        );
    };

    if (is_loading) {
        return <div />;
    }
    return (
        <div
            data-testid='dt_data_table'
            className={classNames('table', {
                [`${className}`]: className,
                [`${className}__table`]: className,
                [`${className}__content`]: className,
            })}
        >
            <div className='table__head'>
                <TableRow
                    className={className}
                    columns={columns}
                    content_loader={content_loader}
                    getActionColumns={getActionColumns}
                    is_header
                    is_footer={false}
                    is_dynamic_height={false}
                />
            </div>
            <div className='table__body'>
                <AutoSizer>
                    {({ width, height }) => (
                        <div
                            className='dc-data-table'
                            style={{
                                height,
                                width,
                            }}
                        >
                            <ThemedScrollbars autohide onScroll={handleScroll}>
                                <List
                                    autoHeight
                                    className={className}
                                    deferredMeasurementCache={cache_ref.current}
                                    height={height}
                                    overscanRowCount={1}
                                    ref={(ref: Grid) => (list_ref.current = ref)}
                                    rowCount={data_source?.length || 0}
                                    rowHeight={
                                        is_dynamic_height && cache_ref?.current?.rowHeight
                                            ? cache_ref?.current?.rowHeight
                                            : getRowSize || 0
                                    }
                                    rowRenderer={rowRenderer}
                                    scrollingResetTimeInterval={0}
                                    scrollTop={scroll_top}
                                    width={width}
                                />
                            </ThemedScrollbars>
                            {children}
                        </div>
                    )}
                </AutoSizer>
            </div>

            {footer && (
                <div className='table__foot'>
                    <TableRow
                        className={className}
                        columns={columns}
                        content_loader={content_loader}
                        getActionColumns={getActionColumns}
                        is_footer
                        row_obj={footer}
                        is_dynamic_height={false}
                    />
                </div>
            )}
        </div>
    );
};

export default DataTable;
