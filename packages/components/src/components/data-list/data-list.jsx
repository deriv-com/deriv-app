import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';
import { isMobile, isDesktop } from '@deriv/shared';
import DataListCell from './data-list-cell.jsx';
import DataListRow from './data-list-row.jsx';
import ThemedScrollbars from '../themed-scrollbars';

const DataList = React.memo(props => {
    const [scroll_top, setScrollTop] = React.useState(0);
    const [is_scrolling, setIsScrolling] = React.useState(false);
    const [is_loading, setLoading] = React.useState(true);

    const { className, children, data_source, footer, getRowSize, keyMapper } = props;
    const cache = React.useRef();
    const list_ref = React.useRef();
    const items_transition_map = {};
    const is_dynamic_height = !getRowSize;

    const trackItemsForTransition = React.useCallback(() => {
        data_source.forEach((item, index) => {
            const row_key = keyMapper?.(item) || `${index}-0`;
            items_transition_map[row_key] = true;
        });
    }, [data_source, items_transition_map, keyMapper]);

    React.useEffect(() => {
        if (is_dynamic_height) {
            cache.current = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => {
                    if (row_index < data_source.length) return keyMapper?.(data_source[row_index]) || row_index;
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
    }, [data_source, is_dynamic_height, trackItemsForTransition]);

    const footerRowRenderer = () => {
        return <React.Fragment>{props.rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    const rowRenderer = ({ style, index, key, parent }) => {
        const { getRowAction, row_gap } = props;
        const row = data_source[index];
        const action = getRowAction && getRowAction(row);
        const destination_link = typeof action === 'string' ? action : undefined;
        const acion_desc = typeof action === 'object' ? action : undefined;
        const row_key = keyMapper?.(row) || key;

        const getContent = ({ measure } = {}) => (
            <DataListRow
                destination_link={destination_link}
                acion_desc={acion_desc}
                row_key={row_key}
                row_gap={row_gap}
                rowRenderer={props.rowRenderer}
                row={row}
                is_scrolling={is_scrolling}
                is_new_row={!items_transition_map[row_key]}
                measure={measure}
            />
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
        if (!is_scrolling) {
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

    if (is_loading) {
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
                                            ? { scrollTop: scroll_top, autoHeight: true }
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
    footer: PropTypes.object,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    keyMapper: PropTypes.func,
    onScroll: PropTypes.func,
    row_gap: PropTypes.number,
    rowRenderer: PropTypes.func,
};

export default DataList;
