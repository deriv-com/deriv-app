import React from 'react';
import classNames from 'classnames';
import Head from './table-head.jsx';
import Header from './table-header.jsx';
import Body from './table-body.jsx';
import Row from './table-row.jsx';
import Cell from './table-cell.jsx';
import ThemedScrollbars from '../themed-scrollbars/themed-scrollbars.jsx';

// TODO: update the <Table /> component to fit with the DataTable in Trader
class Table extends React.Component {
    render() {
        return (
            <div
                role='table'
                className={classNames('dc-table', this.props.className, {
                    'dc-table--scroll': this.props.fixed,
                })}
            >
                {this.props.fixed ? (
                    <ThemedScrollbars
                        has_horizontal
                        width={this.props.scroll_width || '100%'}
                        height={this.props.scroll_height}
                    >
                        {this.props.children}
                    </ThemedScrollbars>
                ) : (
                    this.props.children
                )}
            </div>
        );
    }
}

Table.Head = Head;
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Cell = Cell;
// TODO add footer

export default Table;
