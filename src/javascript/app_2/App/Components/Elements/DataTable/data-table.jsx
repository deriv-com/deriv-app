import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { Scrollbars }                 from 'tt-react-custom-scrollbars';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import TableRow                       from './table-row.jsx';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

class DataTable extends React.PureComponent {
    componentDidUpdate() {
        this.alignHeader();
    }

    alignHeader() {
        // scrollbar inside table-body can push content (depending on the browser and if mouse is plugged in)
        if (!this.props.data_source.length) return;
        const first_body_row   = this.el_table_body.firstChild;
        const scrollbar_offset = this.el_table_head.offsetWidth - first_body_row.offsetWidth;
        this.el_table_head.style.paddingRight = `${scrollbar_offset}px`;
    }

    render() {
        const {
            children,
            columns,
            footer,
            getRowLink,
            is_empty,
            onScroll,
        } = this.props;

        const TableData =
            <React.Fragment>
                {this.props.data_source.map((row_obj, id) =>
                    <TableRow
                        className={this.props.className}
                        row_obj={row_obj}
                        columns={columns}
                        key={id}
                        to={getRowLink && getRowLink(row_obj)}
                    />
                )}
                {children}
            </React.Fragment>;

        return (
            <div className={classNames('table', { [`${this.props.className}__table`]: this.props.className })}>
                <div className='table__head' ref={el => { this.el_table_head = el; }}>
                    <TableRow className={this.props.className} columns={columns} is_header />
                </div>
                <div
                    className='table__body'
                    onScroll={onScroll}
                    ref={el => { this.el_table_body = el; }}
                >
                    {is_empty ?
                        TableData
                        :
                        <Scrollbars
                            style={{ width: '100%', height: 'calc(100vh - 35px)' }}
                            autoHide
                        >
                            {TableData}
                        </Scrollbars>
                    }
                </div>

                {this.props.footer &&
                    <div className='table__foot'>
                        <TableRow
                            className={this.props.className}
                            row_obj={footer}
                            columns={columns}
                            is_footer
                        />
                    </div>
                }
            </div>
        );
    }
}

DataTable.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
    className  : PropTypes.string,
    columns    : PropTypes.array,
    data_source: MobxPropTypes.arrayOrObservableArray,
    footer     : PropTypes.object,
    getRowLink : PropTypes.func,
    onScroll   : PropTypes.func,
};

export default DataTable;
