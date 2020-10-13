import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';
import DataListCell from './data-list-cell.jsx';
import ThemedScrollbars from '../themed-scrollbars';

class DataList extends React.PureComponent {
    state = {
        scrollTop: 0,
        isScrolling: false,
    };
    items_map = {};
    current_data_length = 0;

    constructor(props) {
        super(props);
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            keyMapper: row_index => this.props.keyMapper?.(this.props.data_source[row_index]) || row_index,
        });
        this.trackItems();
    }

    footerRowRenderer = () => {
        const { footer, rowRenderer } = this.props;
        return <React.Fragment>{rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    rowRenderer = ({ style, index, key, parent }) => {
        const { data_source, rowRenderer, getRowAction, keyMapper } = this.props;
        const { isScrolling } = this.state;
        const row = data_source[index];
        const to = getRowAction && getRowAction(row);
        const row_key = keyMapper?.(row) || key;
        const should_show_transition = !isScrolling;
        const is_new_row = !this.items_map[row_key];

        const getContent = ({ measure }) =>
            typeof to === 'string' ? (
                <NavLink
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
                <div className='data-list__item'>
                    {rowRenderer({ row, measure, should_show_transition, is_new_row })}
                </div>
            );

        return (
            <CellMeasurer cache={this.cache} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                {({ measure }) => (
                    <div className='data-list__item--wrapper' style={style}>
                        {getContent({ measure })}
                    </div>
                )}
            </CellMeasurer>
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
        if (this.props.data_source !== prev_props.data_source) {
            this.list_ref.recomputeGridSize(0);
        }
        this.trackItems();
    }

    trackItems() {
        this.props.data_source.forEach((item, index) => {
            const row_key = this.props.keyMapper?.(item) || `${index}-0`;
            this.items_map[row_key] = true;
        });
    }

    render() {
        const { className, children, data_source, footer } = this.props;

        return (
            <AutoSizer>
                {({ width, height }) => (
                    <div className={classNames(className, 'data-list', { [`${className}__data-list`]: className })}>
                        <div className={classNames('data-list__body', { [`${className}__data-list-body`]: className })}>
                            <TransitionGroup>
                                <ThemedScrollbars
                                    style={{
                                        height,
                                        width,
                                    }}
                                    onScroll={this.handleScroll}
                                    autoHide
                                >
                                    <List
                                        ref={ref => (this.list_ref = ref)}
                                        className={className}
                                        deferredMeasurementCache={this.cache}
                                        width={width}
                                        height={height}
                                        overscanRowCount={1}
                                        rowCount={data_source.length}
                                        rowHeight={this.cache.rowHeight}
                                        rowRenderer={this.rowRenderer}
                                        scrollingResetTimeInterval={0}
                                        scrollTop={this.state.scrollTop}
                                        autoHeight
                                    />
                                </ThemedScrollbars>
                            </TransitionGroup>
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
                )}
            </AutoSizer>
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
