import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';
import DataListCell from './data-list-cell.jsx';

class DataList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            keyMapper: row_index => {
                const row_key = this.props.keyMapper?.(this.props.data_source[row_index]) || row_index;
                return row_key;
            },
        });
    }

    footerRowRenderer = () => {
        const { footer, rowRenderer } = this.props;
        return <React.Fragment>{rowRenderer({ row: footer, is_footer: true })}</React.Fragment>;
    };

    rowRenderer = ({ style, index, key, parent }) => {
        const { data_source, rowRenderer, getRowAction, keyMapper } = this.props;
        const row = data_source[index];
        const to = getRowAction && getRowAction(row);
        const row_key = keyMapper?.(row) || key;

        const content =
            typeof to === 'string' ? (
                <NavLink
                    id={`dt_reports_contract_${row_key}`}
                    className={'data-list__item--wrapper'}
                    to={{
                        pathname: to,
                        state: {
                            from_table_row: true,
                        },
                    }}
                >
                    <div className='data-list__item'>{rowRenderer({ row })}</div>
                </NavLink>
            ) : (
                <div className='data-list__item--wrapper'>
                    <div className='data-list__item'>{rowRenderer({ row })}</div>
                </div>
            );

        return (
            <CellMeasurer cache={this.cache} columnIndex={0} key={row_key} rowIndex={index} parent={parent}>
                <div style={style}>{content}</div>
            </CellMeasurer>
        );
    };

    render() {
        const { className, children, data_source, onScroll, footer } = this.props;

        return (
            <div className={classNames(className, 'data-list', `${className}__data-list`)} onScroll={onScroll}>
                <div
                    className={classNames('data-list__body', `${className}__data-list-body`)}
                    ref={ref => (this.el_list_body = ref)}
                >
                    <AutoSizer>
                        {({ width, height }) => (
                            <TransitionGroup>
                                <List
                                    className={className}
                                    deferredMeasurementCache={this.cache}
                                    width={width}
                                    height={height}
                                    overscanRowCount={0}
                                    rowCount={data_source.length}
                                    rowHeight={this.cache.rowHeight}
                                    rowRenderer={this.rowRenderer}
                                    autoHeight
                                    // outerElementType={isMobile() ? null : ThemedScrollbarsWrapper}
                                />
                            </TransitionGroup>
                        )}
                    </AutoSizer>
                    {children}
                </div>
                {footer && (
                    <div className={classNames('data-list__footer', `${className}__data-list-footer`)}>
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
