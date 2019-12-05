import React, { Component } from 'react';
import Head from './table-head.jsx';
import Header from './table-header.jsx';
import Body from './table-body.jsx';
import Row from './table-row.jsx';
import Cell from './table-cell.jsx';
// import PropTypes                      from 'prop-types';
// import classNames                     from 'classnames';

// TODO: update the <Table /> component to fit with the DataTable in Trader
class Table extends Component {
    render() {
        return (
            <div role='table' className='dc-table'>
                {this.props.children}
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
