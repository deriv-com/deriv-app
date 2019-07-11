import classNames                     from 'classnames';
import debounce                       from 'lodash.debounce';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { FixedSizeList as List }      from 'react-window';
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
            height      : 200,
            width       : 200,
            window_width: 1024,
        };
    }

    resizeDimensions = debounce(() => {
        this.setState({
            width       : (window.innerWidth - this.state.window_width) + this.state.width,
            window_width: window.innerWidth,
        });
    }, 250);

    componentDidMount() {
        this.setState({
            height      : this.el_table_body.clientHeight,
            width       : this.el_table_body.clientWidth,
            window_width: window.innerWidth,
        });
        window.onresize = this.resizeDimensions;
    }

    // eslint-disable-next-line class-methods-use-this
    componentWillUnmount() {
        window.onresize = null;
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

    rowRenderer ({
        index,       // Index of row
        style,        // Style object to be applied to row (to position it);
    }) {
        const {
            data_source,
            className,
            getRowAction,
            columns,
            id } = this.props;
        const item = data_source[index];
        const action = getRowAction && getRowAction(item);

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const content = (
            <TableRow
                className={className}
                row_obj={item}
                columns={columns}
                key={id}
                to={typeof action === 'string' ? action : undefined}
                replace={typeof action === 'object' ? action : undefined}
            />
        );

        return (
            <div style={style}>
                {content}
            </div>
        );
    }

    render() {
        const {
            children,
            className,
            columns,
            data_source,
            footer,
            is_empty,
            onScroll,
        } = this.props;

        const TableData =

            <React.Fragment>
                <List
                    className={className}
                    height={this.state.deposit_height}
                    itemCount={data_source.length}
                    itemSize={63}
                    width={this.state.width}
                >
                    {this.rowRenderer.bind(this)}
                </List>
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
                            autoHeightMax={this.state.deposit_height}
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
