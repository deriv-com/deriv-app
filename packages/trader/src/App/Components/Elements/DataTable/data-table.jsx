import classNames                     from 'classnames';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import { VariableSizeList as List }   from 'react-window';
import { ThemedScrollbars }           from 'deriv-components';
import PropTypes                      from 'prop-types';
import React, { useCallback }         from 'react';
import TableRow                       from './table-row.jsx';

/* TODO:
      1. implement sorting by column (ASC/DESC)
      2. implement filtering per column
*/

const ListScrollbar = React.forwardRef((props, ref) => (
    <ExtendedScrollbars {...props} forwardedRef={ref} />
));

// Display name is required by Developer Tools to give a name to the components we use.
// If a component doesn't have a displayName is will be shown as <Unknown />. Hence, name is set.
ListScrollbar.displayName = 'ListScrollbar';

const ExtendedScrollbars = ({ onScroll, forwardedRef, style, children }) => {
    const refSetter = useCallback(scrollbarsRef => {
        if (scrollbarsRef) {
            forwardedRef(scrollbarsRef.view);
        } else {
            forwardedRef(null);
        }
    }, []);

    return (
        <ThemedScrollbars
            ref={refSetter}
            style={{ ...style, overflow: 'hidden' }}
            onScroll={onScroll}
            autoHide
        >
            {children}
        </ThemedScrollbars>
    );
};

const DataTable = ({
    data_source,
    className,
    getRowAction,
    getRowSize,
    columns,
    onScroll,
    footer,
    preloaderCheck,
    id,
    is_empty,
    custom_height,
    custom_width,
    children,
}) => {
    const [height, setHeight]            = React.useState(200);
    const [width, setWidth]              = React.useState(200);
    const [window_width, setWindowWidth] = React.useState(1024);
    let el_table_body                  = React.createRef();
    let el_table_head                  = React.createRef();

    const rowRenderer = ({
        index,       // Index of row
        style,        // Style object to be applied to row (to position it);
    }) => {
        const item        = data_source[index];
        const action      = getRowAction && getRowAction(item);
        const contract_id = data_source[index].contract_id || data_source[index].id;

        // If row content is complex, consider rendering a light-weight placeholder while scrolling.
        const content = (
            <TableRow
                className={className}
                row_obj={item}
                columns={columns}
                id={contract_id}
                key={id}
                to={typeof action === 'string' ? action : undefined}
                show_preloader={(typeof preloaderCheck === 'function') ? preloaderCheck(item) : null}
                replace={typeof action === 'object' ? action : undefined}
            />
        );

        return (
            <div style={style}>
                {content}
            </div>
        );
    };

    React.useEffect(() => {
        setHeight(custom_height || el_table_body.clientHeight);
        setWidth(custom_width || el_table_body.clientWidth);
        setWindowWidth(window.innerWidth);
    });

    const TableData = (
        <React.Fragment>
            <List
                className={className}
                height={height}
                itemCount={data_source.length}
                itemSize={getRowSize}
                width={width}
                outerElementType={is_empty ? null : ListScrollbar}
            >
                {rowRenderer}
            </List>
            {children}
        </React.Fragment>
    );

    return (
        <div className={classNames('table', {
            [`${className}`]         : className,
            [`${className}__table`]  : className,
            [`${className}__content`]: className,
        })}
        >
            <div className='table__head' ref={el => { el_table_head = el; }}>
                <TableRow className={className} columns={columns} is_header />
            </div>
            <div
                className='table__body'
                ref={el => { el_table_body = el; }}
                onScroll={onScroll}
            >
                {TableData}
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
};

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
    getRowSize  : PropTypes.func.isRequired,
    onScroll    : PropTypes.func,
};

export default DataTable;
