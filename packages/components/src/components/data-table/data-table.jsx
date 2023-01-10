import classNames from 'classnames';
import { List } from '@enykeev/react-virtualized/dist/es/List';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer } from '@enykeev/react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from '@enykeev/react-virtualized/dist/es/CellMeasurer';
import TableRow from './table-row.jsx';
import ThemedScrollbars from '../themed-scrollbars';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

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
}) => {
    const cache_ref = React.useRef();
    const list_ref = React.useRef();
    const is_dynamic_height = !getRowSize;
    const [scroll_top, setScrollTop] = React.useState(0);
    const [is_loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (is_dynamic_height) {
            cache_ref.current = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => {
                    if (row_index < data_source.length) return keyMapper?.(data_source[row_index]) || row_index;
                    return row_index;
                },
            });
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_dynamic_height) list_ref.current?.recomputeGridSize(0);
    }, [data_source, is_dynamic_height]);

    const handleScroll = ev => {
        setScrollTop(ev.target.scrollTop);
        if (typeof onScroll === 'function') onScroll(ev);
    };

    const rowRenderer = ({ style, index, key, parent }) => {
        const item = data_source[index];
        const action = getRowAction && getRowAction(item);
        const contract_id = item.contract_id || item.id;
        const row_key = keyMapper?.(item) || key;

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const getContent = ({ measure } = {}) => (
            <TableRow
                className={className}
                columns={columns}
                content_loader={content_loader}
                getActionColumns={getActionColumns}
                id={contract_id}
                key={id}
                measure={measure}
                passthrough={passthrough}
                replace={typeof action === 'object' ? action : undefined}
                row_obj={item}
                show_preloader={typeof preloaderCheck === 'function' ? preloaderCheck(item) : false}
                to={typeof action === 'string' ? action : undefined}
                is_dynamic_height={is_dynamic_height}
            />
        );

        return is_dynamic_height ? (
            <CellMeasurer cache={cache_ref.current} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                {({ measure }) => <div style={style}>{getContent({ measure })}</div>}
            </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent()}
            </div>
        );
    };

    if (is_loading) {
        return <div />;
    }
    return (
        <div
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
                            <ThemedScrollbars autoHide onScroll={handleScroll}>
                                <List
                                    autoHeight
                                    className={className}
                                    deferredMeasurementCache={cache_ref.current}
                                    height={height}
                                    overscanRowCount={1}
                                    ref={ref => (list_ref.current = ref)}
                                    rowCount={data_source.length}
                                    rowHeight={is_dynamic_height ? cache_ref?.current.rowHeight : getRowSize}
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
                    />
                </div>
            )}
        </div>
    );
};

DataTable.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    className: PropTypes.string,
    columns: PropTypes.array,
    data_source: PropTypes.array,
    footer: PropTypes.object,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    onScroll: PropTypes.func,
    passthrough: PropTypes.object,
    content_loader: PropTypes.elementType,
    getActionColumns: PropTypes.func,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    keyMapper: PropTypes.func,
    preloaderCheck: PropTypes.func,
};

export default DataTable;
