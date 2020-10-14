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
    items_map = {};

    constructor(props) {
        super(props);
        const { is_dynamic_height } = props;

        if (is_dynamic_height) {
            this.cache = new CellMeasurerCache({
                fixedWidth: true,
                keyMapper: row_index => this.props.keyMapper?.(this.props.data_source[row_index]) || row_index,
            });
            this.trackItems();
        }
    }

    footerRowRenderer = () => {
        const { footer, rowRenderer } = this.props;
        return <React.Fragment>{rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    rowRenderer = ({ style, index, key, parent }) => {
        const { data_source, rowRenderer, getRowAction, keyMapper, is_dynamic_height, row_gap } = this.props;
        const { isScrolling } = this.state;
        const row = data_source[index];
        const to = getRowAction && getRowAction(row);
        const row_key = keyMapper?.(row) || key;
        const should_show_transition = !isScrolling;
        const is_new_row = !this.items_map[row_key];

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
                        <div className='data-list__item'>
                            {rowRenderer({ row, measure, should_show_transition, is_new_row })}
                        </div>
                    </NavLink>
                ) : (
                    <div className='data-list__item--wrapper'>
                        <div className='data-list__item'>
                            {rowRenderer({ row, measure, should_show_transition, is_new_row })}
                        </div>
                    </div>
                )}
            </div>
        );

        return is_dynamic_height ? (
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
        if (this.props.onScroll) {
            this.props.onScroll(ev);
        }
    };

    componentDidUpdate(prev_props) {
        const { is_dynamic_height } = this.props;
        if (is_dynamic_height) {
            if (this.props.data_source !== prev_props.data_source) {
                this.list_ref.recomputeGridSize(0);
            }
            this.trackItems();
        }
    }

    trackItems() {
        this.props.data_source.forEach((item, index) => {
            const row_key = this.props.keyMapper?.(item) || `${index}-0`;
            this.items_map[row_key] = true;
        });
    }

    render() {
        const { className, children, data_source, footer, is_dynamic_height, getRowSize } = this.props;

        return (
            <div
                className={classNames(className, 'data-list', {
                    [`${className}__data-list`]: className,
                    'data-list--dynamic-height': is_dynamic_height,
                })}
            >
                <div className={classNames('data-list__body', { [`${className}__data-list-body`]: className })}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <TransitionGroup>
                                <ThemedScrollbars
                                    style={{
                                        height,
                                        width,
                                    }}
                                    onScroll={this.handleScroll}
                                    autoHide
                                    is_bypassed={isMobile()}
                                >
                                    <List
                                        ref={ref => (this.list_ref = ref)}
                                        className={className}
                                        deferredMeasurementCache={this.cache}
                                        width={width}
                                        height={height}
                                        overscanRowCount={1}
                                        rowCount={data_source.length}
                                        rowHeight={is_dynamic_height ? this.cache.rowHeight : getRowSize}
                                        rowRenderer={this.rowRenderer}
                                        scrollingResetTimeInterval={0}
                                        {...(isDesktop() ? { scrollTop: this.state.scrollTop, autoHeight: true } : {})}
                                    />
                                </ThemedScrollbars>
                            </TransitionGroup>
                        )}
                    </AutoSizer>
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
