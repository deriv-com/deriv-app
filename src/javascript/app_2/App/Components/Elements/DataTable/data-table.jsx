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
    constructor(props) {
        super(props);
        this.state = {
            height: 200,
        };
    }

    componentDidMount() {
        this.setState({
            height: this.el_table_body.clientHeight,
        });
    }

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
            className,
            columns,
            data_source,
            footer,
            getRowAction,
            is_empty,
            onScroll,
        } = this.props;

        const TableData =
            <React.Fragment>
                {data_source.map((row_obj, id) => {
                    const action = getRowAction && getRowAction(row_obj);

                    return (
                        <TableRow
                            className={className}
                            row_obj={row_obj}
                            columns={columns}
                            key={id}
                            to={typeof action === 'string' ? action : undefined}
                            replace={typeof action === 'object' ? action : undefined}
                        />
                    );
                }
                )}
                {children}
            </React.Fragment>;

        return (
            <div className={classNames('table', {
                [`${className}`]         : className,
                [`${className}__table`]  : className,
                [`${className}__content`]: className,
            })}
            >
                <div className='table__head' ref={el => { this.el_table_head = el; }}>
                    <TableRow className={className} columns={columns} is_header />
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
                            autoHeight
                            autoHeightMax={this.state.height}
                            autoHide
                        >
                            {TableData}
                        </Scrollbars>
                    }
                </div>

                {footer &&
                    <div className='table__foot'>
                        <TableRow
                            className={className}
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
    className   : PropTypes.string,
    columns     : PropTypes.array,
    data_source : MobxPropTypes.arrayOrObservableArray,
    footer      : PropTypes.object,
    getRowAction: PropTypes.func,
    onScroll    : PropTypes.func,
};

export default DataTable;
