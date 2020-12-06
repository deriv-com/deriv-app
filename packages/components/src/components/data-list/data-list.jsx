import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';
import { isMobile, isDesktop } from '@deriv/shared';
import DataListCell from './data-list-cell.jsx';
import DataListRowWrapper from './data-list-row-wrapper.jsx';
import ThemedScrollbars from '../themed-scrollbars';

const DataList = React.memo(props => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const cache = React.useRef();
    const list_ref = React.useRef();
    const items_transition_map = {};
    const is_dynamic_height = !props.getRowSize;

    const trackItemsForTransition = () => {
        props.data_source.forEach((item, index) => {
            const row_key = props.keyMapper?.(item) || `${index}-0`;
            items_transition_map[row_key] = true;
        });
    };

    React.useEffect(() => {
        if (is_dynamic_height) {
            cache.current = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => {
                    if (row_index < props.data_source.length)
                        return props.keyMapper?.(props.data_source[row_index]) || row_index;
                    return row_index;
                },
            });
        }
        trackItemsForTransition();
        setLoading(false);
    }, []);

    React.useEffect(() => {
        if (is_dynamic_height) {
            list_ref.current?.recomputeGridSize(0);
        }
        trackItemsForTransition();
    }, [props.data_source]);

    const footerRowRenderer = () => {
        const { footer, rowRenderer } = props;
        return <React.Fragment>{rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    const rowRenderer = ({ style, index, key, parent }) => {
        const { data_source, getRowAction, keyMapper, row_gap } = props;
        const row = data_source[index];
        const action = getRowAction && getRowAction(row);
        const to = typeof action === 'string' ? action : undefined;
        const replace = typeof action === 'object' ? action : undefined;
        const row_key = keyMapper?.(row) || key;
        const is_new_row = !items_transition_map[row_key];

        const getContent = ({ measure } = {}) => (
            <DataListRowWrapper to={to} replace={replace} row_key={row_key} row_gap={row_gap}>
                <div className='data-list__item'>{props.rowRenderer({ row, measure, isScrolling, is_new_row })}</div>
            </DataListRowWrapper>
        );

        return is_dynamic_height ? (
            <CellMeasurer cache={cache.current} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                {({ measure }) => <div style={style}>{getContent({ measure })}</div>}
            </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent()}
            </div>
        );
    };

    const handleScroll = ev => {
        clearTimeout(timeout);
        if (!isScrolling) {
            setIsScrolling(true);
        }
        const timeout = setTimeout(() => {
            setIsScrolling(false);
        }, 200);

        setScrollTop(ev.target.scrollTop);
        if (typeof props.onScroll === 'function') {
            props.onScroll(ev);
        }
    };

    const { className, children, data_source, footer, getRowSize } = props;
    if (loading) {
        return <div />;
    }
    return (
        <div
            className={classNames(className, 'data-list', {
                [`${className}__data-list`]: className,
            })}
        >
            <div className='data-list__body-wrapper'>
                <div className={classNames('data-list__body', { [`${className}__data-list-body`]: className })}>
                    <AutoSizer>
                        {({ width, height }) => (
                            // Don't remove `TransitionGroup`. When `TransitionGroup` is removed, transition life cycle events like `onEntered` won't be fired sometimes on it's `CSSTransition` children
                            <TransitionGroup style={{ height, width }}>
                                <ThemedScrollbars onScroll={handleScroll} autoHide is_bypassed={isMobile()}>
                                    <List
                                        ref={list_ref}
                                        className={className}
                                        deferredMeasurementCache={cache.current}
                                        width={width}
                                        height={height}
                                        overscanRowCount={1}
                                        rowCount={data_source.length}
                                        rowHeight={is_dynamic_height ? cache?.current.rowHeight : getRowSize}
                                        rowRenderer={rowRenderer}
                                        scrollingResetTimeInterval={0}
                                        {...(isDesktop()
                                            ? { scrollTop, autoHeight: true }
                                            : { onScroll: target => handleScroll({ target }) })}
                                    />
                                </ThemedScrollbars>
                            </TransitionGroup>
                        )}
                    </AutoSizer>
                </div>
                {children}
            </div>
            {footer && (
                <div
                    className={classNames('data-list__footer', {
                        [`${className}__data-list-footer`]: className,
                    })}
                >
                    {footerRowRenderer()}
                </div>
            )}
        </div>
    );
});

DataList.Cell = DataListCell;
DataList.propTypes = {
    className: PropTypes.string,
    data_source: PropTypes.array,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    rowRenderer: PropTypes.func,
    onScroll: PropTypes.func,
};

export default DataList;
