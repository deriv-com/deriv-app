import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';
import { isMobile, isDesktop } from '@deriv/shared';
import DataListCell from './data-list-cell.jsx';
import ThemedScrollbars from '../themed-scrollbars';

class DataList extends React.PureComponent {
    state = {
        scrollTop: 0,
        isScrolling: false,
    };
    items_transition_map = {};

    constructor(props) {
        super(props);
        const { getRowSize } = props;
        this.is_dynamic_height = !getRowSize;

        if (this.is_dynamic_height) {
            this.cache = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => this.props.keyMapper?.(this.props.data_source[row_index]) || row_index,
            });
        }
        this.trackItemsForTransition();
    }

    footerRowRenderer = () => {
        const { footer, rowRenderer } = this.props;
        return <React.Fragment>{rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    rowRenderer = ({ style, index, key, parent }) => {
        const { data_source, rowRenderer, getRowAction, keyMapper, row_gap } = this.props;
        const { isScrolling } = this.state;
        const row = data_source[index];
        const to = getRowAction && getRowAction(row);
        const row_key = keyMapper?.(row) || key;
        const is_new_row = !this.items_transition_map[row_key];

        const getContent = ({ measure } = {}) => (
            <div style={{ paddingBottom: `${row_gap || 0}px` }}>
                {typeof to === 'string' ? (
                    <NavLink
                        className='data-list__item--wrapper'
                        id={`dt_reports_contract_${row_key}`}
                        to={{
                            pathname: to,
                            state: {
                                from_table_row: true,
                            },
                        }}
                    >
                        <div className='data-list__item'>{rowRenderer({ row, measure, isScrolling, is_new_row })}</div>
                    </NavLink>
                ) : (
                    <div className='data-list__item--wrapper'>
                        <div className='data-list__item'>{rowRenderer({ row, measure, isScrolling, is_new_row })}</div>
                    </div>
                )}
            </div>
        );

        return this.is_dynamic_height ? (
            <CellMeasurer cache={this.cache} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                {({ measure }) => <div style={style}>{getContent({ measure })}</div>}
            </CellMeasurer>
        ) : (
            <div key={row_key} style={style}>
                {getContent()}
            </div>
        );
    };

    handleScroll = ev => {
        clearTimeout(this.timeout);

        const { isScrolling } = this.state;
        if (!isScrolling) {
            this.setState({ isScrolling: true });
        }

        this.timeout = setTimeout(() => {
            this.setState({ isScrolling: false });
        }, 200);

        const { scrollTop } = ev.target;
        this.setState({ scrollTop });
        if (typeof this.props.onScroll === 'function') {
            this.props.onScroll(ev);
        }
    };

    componentDidUpdate(prev_props) {
        if (this.is_dynamic_height) {
            if (this.props.data_source !== prev_props.data_source) {
                this.list_ref.recomputeGridSize(0);
            }
        }
        this.trackItemsForTransition();
    }

    trackItemsForTransition() {
        this.props.data_source.forEach((item, index) => {
            const row_key = this.props.keyMapper?.(item) || `${index}-0`;
            this.items_transition_map[row_key] = true;
        });
    }

    render() {
        const { className, children, data_source, footer, getRowSize } = this.props;

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
                                    <ThemedScrollbars onScroll={this.handleScroll} autoHide is_bypassed={isMobile()}>
                                        <List
                                            ref={ref => (this.list_ref = ref)}
                                            className={className}
                                            deferredMeasurementCache={this.cache}
                                            width={width}
                                            height={height}
                                            overscanRowCount={1}
                                            rowCount={data_source.length}
                                            rowHeight={this.is_dynamic_height ? this.cache.rowHeight : getRowSize}
                                            rowRenderer={this.rowRenderer}
                                            scrollingResetTimeInterval={0}
                                            {...(isDesktop()
                                                ? { scrollTop: this.state.scrollTop, autoHeight: true }
                                                : { onScroll: target => this.handleScroll({ target }) })}
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
                        {this.footerRowRenderer()}
                    </div>
                )}
            </div>
        );
    }
}
DataList.Cell = DataListCell;
DataList.propTypes = {
    className: PropTypes.string,
    data_source: PropTypes.array,
    getRowAction: PropTypes.func,
    getRowSize: PropTypes.func,
    rowRenderer: PropTypes.func,
};

export default DataList;
