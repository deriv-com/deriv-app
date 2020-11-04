import classNames from 'classnames';
import { List } from 'react-virtualized/dist/es/List';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import TableRow from './table-row.jsx';
import ThemedScrollbars from '../themed-scrollbars';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.PureComponent {
    state = {
        scrollTop: 0,
    };

    handleScroll = ev => {
        const { scrollTop } = ev.target;
        this.setState({ scrollTop });
        if (typeof this.props.onScroll === 'function') {
            this.props.onScroll(ev);
        }
    };

    rowRenderer = ({ style, index, key }) => {
        const {
            className,
            getRowAction,
            columns,
            preloaderCheck,
            id,
            getActionColumns,
            content_loader,
            data_source,
            keyMapper,
        } = this.props;
        const item = data_source[index];
        const action = getRowAction && getRowAction(item);
        const contract_id = data_source[index].contract_id || data_source[index].id;
        const row_key = keyMapper?.(item) || key;

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const content = (
            <TableRow
                className={className}
                row_obj={item}
                columns={columns}
                id={contract_id}
                key={id}
                to={typeof action === 'string' ? action : undefined}
                show_preloader={typeof preloaderCheck === 'function' ? preloaderCheck(item) : null}
                replace={typeof action === 'object' ? action : undefined}
                getActionColumns={getActionColumns}
                content_loader={content_loader}
            />
        );

        return (
            <div key={row_key} style={style}>
                {content}
            </div>
        );
    };

    render() {
        const {
            children,
            className,
            columns,
            data_source,
            footer,
            getActionColumns,
            getRowSize,
            content_loader,
        } = this.props;

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
                                    ref={ref => (this.list_ref = ref)}
                                    className={className}
                                    width={width}
                                    height={height}
                                    overscanRowCount={1}
                                    rowCount={data_source.length}
                                    rowHeight={getRowSize}
                                    rowRenderer={this.rowRenderer}
                                    scrollingResetTimeInterval={0}
                                    scrollTop={this.state.scrollTop}
                                    autoHeight
                                />
                            </ThemedScrollbars>
                            {children}
                        </div>
                    )}
                </AutoSizer>
            </React.Fragment>
        );

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
                        is_header
                        getActionColumns={getActionColumns}
                        content_loader={content_loader}
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
                            row_obj={footer}
                            columns={columns}
                            is_footer
                            getActionColumns={getActionColumns}
                            content_loader={content_loader}
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
};

export default DataTable;
