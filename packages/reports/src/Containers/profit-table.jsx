import classNames from 'classnames';
import PropTypes from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import React from 'react';
import { withRouter } from 'react-router';
import { DesktopWrapper, MobileWrapper, DataList, DataTable } from '@deriv/components';
import { extractInfoFromShortcode, isForwardStarting, getUnsupportedContracts, getContractPath } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import CompositeCalendar from '../Components/Form/CompositeCalendar';
import { getSupportedContracts } from '_common/contract';

import { connect } from 'Stores/connect';
import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message.jsx';
import PlaceholderComponent from '../Components/placeholder-component.jsx';
import { ReportsMeta } from '../Components/reports-meta.jsx';
import { getProfitTableColumnsTemplate } from 'Constants/data-table-constants';

const getRowAction = row_obj => {
    const contract_type = extractInfoFromShortcode(row_obj.shortcode).category.toUpperCase();
    return getSupportedContracts()[contract_type] && !isForwardStarting(row_obj.shortcode, row_obj.purchase_time_unix)
        ? getContractPath(row_obj.contract_id)
        : {
              component: (
                  <Localize
                      i18n_default_text="The {{trade_type_name}} contract details aren't currently available. We're working on making them available soon."
                      values={{
                          trade_type_name: getUnsupportedContracts()[contract_type]?.name,
                      }}
                  />
              ),
          };
};

const ProfitTable = ({
    component_icon,
    currency,
    data,
    date_from,
    date_to,
    error,
    filtered_date_range,
    is_empty,
    is_loading,
    is_switching,
    handleDateChange,
    handleScroll,
    has_selected_date,
    onMount,
    onUnmount,
    totals,
}) => {
    React.useEffect(() => {
        onMount();
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) return <p>{error}</p>;

    const filter_component = (
        <CompositeCalendar
            input_date_range={filtered_date_range}
            onChange={handleDateChange}
            from={date_from}
            to={date_to}
        />
    );

    const columns = getProfitTableColumnsTemplate(currency, data.length);
    const columns_map = columns.reduce((map, item) => {
        map[item.col_index] = item;
        return map;
    }, {});

    const mobileRowRenderer = ({ row, is_footer }) => {
        const duration_type = /^MULTUP|MULTDOWN/.test(row.shortcode) ? '' : row.duration_type;
        const duration_classname = duration_type ? `duration-type__${duration_type.toLowerCase()}` : '';

        if (is_footer) {
            return (
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.action_type} is_footer={is_footer} />
                    <DataList.Cell
                        className='data-list__row-cell--amount'
                        row={row}
                        column={columns_map.profit_loss}
                        is_footer={is_footer}
                    />
                </div>
            );
        }

        return (
            <>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.action_type} />
                    <div className={classNames('duration-type', duration_classname)}>
                        <div className={classNames('duration-type__background', `${duration_classname}__background`)} />
                        <span className={`${duration_classname}__label`}>{localize(duration_type)}</span>
                    </div>
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.transaction_id} />
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.currency} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.purchase_time} />
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.buy_price} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.sell_time} />
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.sell_price} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.profit_loss} />
                </div>
            </>
        );
    };

    return (
        <React.Fragment>
            <ReportsMeta filter_component={filter_component} className='profit-table__filter' />
            {is_switching ? (
                <PlaceholderComponent is_loading />
            ) : (
                <React.Fragment>
                    {data.length === 0 || is_empty ? (
                        <PlaceholderComponent
                            is_loading={is_loading}
                            has_selected_date={has_selected_date}
                            is_empty={is_empty}
                            empty_message_component={EmptyTradeHistoryMessage}
                            component_icon={component_icon}
                            localized_message={localize('You have no trading activity yet.')}
                            localized_period_message={localize(
                                "You've made no transactions of this type during this period."
                            )}
                        />
                    ) : (
                        <div className='reports__content'>
                            <DesktopWrapper>
                                <DataTable
                                    className='profit-table'
                                    data_source={data}
                                    columns={columns}
                                    onScroll={handleScroll}
                                    footer={totals}
                                    is_empty={is_empty}
                                    getRowAction={getRowAction}
                                    getRowSize={() => 63}
                                    content_loader={ReportsTableRowLoader}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataTable>
                            </DesktopWrapper>
                            <MobileWrapper>
                                <DataList
                                    className='profit-table'
                                    data_source={data}
                                    rowRenderer={mobileRowRenderer}
                                    getRowAction={getRowAction}
                                    onScroll={handleScroll}
                                    footer={totals}
                                    row_gap={8}
                                >
                                    <PlaceholderComponent is_loading={is_loading} />
                                </DataList>
                            </MobileWrapper>
                        </div>
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

ProfitTable.propTypes = {
    component_icon: PropTypes.string,
    currency: PropTypes.string,
    data: MobxPropTypes.arrayOrObservableArray,
    date_from: PropTypes.number,
    date_to: PropTypes.number,
    error: PropTypes.string,
    filtered_date_range: PropTypes.object,
    is_empty: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_switching: PropTypes.bool,
    handleDateChange: PropTypes.func,
    handleScroll: PropTypes.func,
    has_selected_date: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    totals: PropTypes.object,
};

export default connect(({ modules, client }) => ({
    currency: client.currency,
    data: modules.profit_table.data,
    date_from: modules.profit_table.date_from,
    date_to: modules.profit_table.date_to,
    error: modules.profit_table.error,
    filtered_date_range: modules.profit_table.filtered_date_range,
    is_empty: modules.profit_table.is_empty,
    is_loading: modules.profit_table.is_loading,
    is_switching: client.is_switching,
    handleDateChange: modules.profit_table.handleDateChange,
    handleScroll: modules.profit_table.handleScroll,
    has_selected_date: modules.profit_table.has_selected_date,
    onMount: modules.profit_table.onMount,
    onUnmount: modules.profit_table.onUnmount,
    totals: modules.profit_table.totals,
}))(withRouter(ProfitTable));
