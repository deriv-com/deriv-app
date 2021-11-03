import classNames from 'classnames';
import { List } from 'react-virtualized/dist/es/List';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import TableRow from './table-row.jsx';
import ThemedScrollbars from '../themed-scrollbars';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.PureComponent {
    cache_ref = React.createRef();
    is_dynamic_height = !this.props.getRowSize;
    state = {
        scrollTop: 0,
        is_loading: true,
    };

    componentDidMount() {
        if (this.is_dynamic_height) {
            this.cache_ref.current = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => {
                    if (row_index < this.props.data_source.length)
                        return this.props.keyMapper?.(this.props.data_source[row_index]) || row_index;
                    return row_index;
                },
            });
        }
        this.setState({ is_loading: false });
    }

    componentDidUpdate(prevProps) {
        if (this.props.data_source !== prevProps.data_source || this.props.getRowSize !== prevProps.getRowSize) {
            if (this.is_dynamic_height) {
                this.list_ref.current?.recomputeGridSize(0);
            }
        }
    }

    handleScroll = ev => {
        const { scrollTop } = ev.target;
        this.setState({ scrollTop });
        if (typeof this.props.onScroll === 'function') {
            this.props.onScroll(ev);
        }
    };

    rowRenderer = ({ style, index, key, parent }) => {
        const {
            className,
            columns,
            content_loader,
            data_source,
            getActionColumns,
            getRowAction,
            id,
            keyMapper,
            passthrough,
            preloaderCheck,
        } = this.props;
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
                is_dynamic_height={this.is_dynamic_height}
            />
        );

        return this.is_dynamic_height ? (
            <CellMeasurer cache={this.cache_ref.current} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                {({ measure }) => <div style={style}>{getContent({ measure })}</div>}
            </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent()}
            </div>
        );
    };

    render() {
        const { children, className, columns, content_loader, data_source, footer, getActionColumns, getRowSize } =
            this.props;

        const TableData = (
            <React.Fragment>
                <AutoSizer>
                    {({ width, height }) => (
                        <div
                            className='dc-data-table'
                            style={{
                                height,
                                width,
                            }}
                        >
                            <ThemedScrollbars autoHide onScroll={this.handleScroll}>
                                <List
                                    autoHeight
                                    className={className}
                                    deferredMeasurementCache={this.cache_ref.current}
                                    height={height}
                                    overscanRowCount={1}
                                    ref={ref => (this.list_ref = ref)}
                                    rowCount={data_source.length}
                                    rowHeight={this.is_dynamic_height ? this.cache_ref?.current.rowHeight : getRowSize}
                                    rowRenderer={this.rowRenderer}
                                    scrollingResetTimeInterval={0}
                                    scrollTop={this.state.scrollTop}
                                    width={width}
                                />
                            </ThemedScrollbars>
                            {children}
                        </div>
                    )}
                </AutoSizer>
            </React.Fragment>
        );

        if (this.state.is_loading) {
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
                <div
                    className='table__head'
                    ref={el => {
                        this.el_table_head = el;
                    }}
                >
                    <TableRow
                        className={className}
                        columns={columns}
                        content_loader={content_loader}
                        getActionColumns={getActionColumns}
                        is_header
                    />
                </div>
                <div
                    className='table__body'
                    ref={el => {
                        this.el_table_body = el;
                    }}
                >
                    {TableData}
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
    }
}

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
};

export default DataTable;
