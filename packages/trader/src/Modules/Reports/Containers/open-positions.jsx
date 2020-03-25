import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { DesktopWrapper, MobileWrapper, ProgressBar, Tabs } from '@deriv/components';
import { urlFor } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';
import DataList from 'App/Components/Elements/DataList';
import DataTable from 'App/Components/Elements/DataTable';
import MultiplierCloseActions from 'App/Components/Elements/PositionsDrawer/PositionsDrawerCard/multiplier-close-actions.jsx';
import { getTimePercentage } from 'App/Components/Elements/PositionsDrawer/helpers';
import { website_name } from 'App/Constants/app-config';
import { getContractPath } from 'App/Components/Routes/helpers';
import { getContractDurationType } from 'Modules/Reports/Helpers/market-underlying';
import EmptyTradeHistoryMessage from 'Modules/Reports/Components/empty-trade-history-message.jsx';
import {
    getOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate,
} from 'Modules/Reports/Constants/data-table-constants';
import PlaceholderComponent from 'Modules/Reports/Components/placeholder-component.jsx';
import { connect } from 'Stores/connect';
import { isMultiplierContract } from 'Stores/Modules/Contract/Helpers/multiplier';
import { ReportsMeta } from '../Components/reports-meta.jsx';

const getActionColumns = ({ onClickCancel, onClickSell, getPositionById }) => ({ row_obj, is_header, is_footer }) => {
    if (is_header || is_footer) {
        return <div className='open-positions__row-action' />;
    }

    const { contract_info } = row_obj;
    const position = getPositionById(contract_info.contract_id);
    const { is_sell_requested } = position || {};

    return (
        <div className='open-positions__row-action'>
            <MultiplierCloseActions
                contract_info={contract_info}
                is_sell_requested={is_sell_requested}
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
            />
        </div>
    );
};

const EmptyPlaceholderWrapper = props => (
    <React.Fragment>
        {props.is_empty ? (
            <PlaceholderComponent
                is_empty={props.is_empty}
                empty_message_component={EmptyTradeHistoryMessage}
                component_icon={props.component_icon}
                localized_message={localize('You have no open positions yet.')}
            />
        ) : (
            props.children
        )}
    </React.Fragment>
);

const OpenPositionsTable = ({
    className,
    columns,
    component_icon,
    currency,
    active_positions,
    is_loading,
    getRowAction,
    mobileRowRenderer,
    preloaderCheck,
    action_column,
    totals,
}) => (
    <React.Fragment>
        {is_loading ? (
            <PlaceholderComponent
                is_loading={is_loading}
                empty_message_component={EmptyTradeHistoryMessage}
                component_icon={component_icon}
                localized_message={localize('You have no open positions yet.')}
            />
        ) : (
            currency && (
                <>
                    <DesktopWrapper>
                        <EmptyPlaceholderWrapper
                            component_icon={component_icon}
                            is_empty={active_positions.length === 0}
                        >
                            <DataTable
                                className={className}
                                columns={columns}
                                preloaderCheck={preloaderCheck}
                                footer={totals}
                                data_source={active_positions}
                                getActionColumns={action_column}
                                getRowAction={getRowAction}
                                getRowSize={() => 63}
                                custom_width={'100%'}
                            >
                                <PlaceholderComponent is_loading={is_loading} />
                            </DataTable>
                        </EmptyPlaceholderWrapper>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <EmptyPlaceholderWrapper
                            component_icon={component_icon}
                            is_empty={active_positions.length === 0}
                        >
                            <DataList
                                className={className}
                                data_source={active_positions}
                                footer={totals}
                                rowRenderer={mobileRowRenderer}
                                getRowAction={getRowAction}
                                custom_width={'100%'}
                                getRowSize={() => 194}
                            >
                                <PlaceholderComponent is_loading={is_loading} />
                            </DataList>
                        </EmptyPlaceholderWrapper>
                    </MobileWrapper>
                </>
            )
        )}
    </React.Fragment>
);

class OpenPositions extends React.Component {
    state = {
        active_index: this.props.is_multiplier ? 1 : 0,
    };

    componentDidMount() {
        this.props.onMount();

        const { getPositionById, onClickCancel, onClickSell } = this.props;
        this.getActionColumns = getActionColumns({ getPositionById, onClickCancel, onClickSell });
    }

    componentWillUnmount() {
        this.props.onUnmount();
    }

    mobileRowRenderer = ({ row, is_footer }) => {
        if (is_footer) {
            return (
                <>
                    <span className='open-positions__data-list-footer--title'>Total</span>
                    <div className='open-positions__data-list-footer--content'>
                        <div>
                            <DataList.Cell row={row} column={this.columns_map.purchase} />
                            <DataList.Cell row={row} column={this.columns_map.payout} />
                        </div>
                        <div>
                            <DataList.Cell
                                className='data-list__row-cell--amount'
                                row={row}
                                column={this.columns_map.indicative}
                            />
                            <DataList.Cell
                                className='data-list__row-cell--amount'
                                row={row}
                                column={this.columns_map.profit}
                            />
                        </div>
                    </div>
                </>
            );
        }

        const { server_time } = this.props;
        const { contract_info } = row;
        const { date_expiry, date_start } = contract_info;
        const duration_type = getContractDurationType(contract_info.longcode);
        const progress_value = getTimePercentage(server_time, date_start, date_expiry) / 100;

        return (
            <>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.type} />
                    <ProgressBar label={duration_type} value={progress_value} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.reference} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.purchase} />
                    <DataList.Cell
                        className='data-list__row-cell--amount'
                        row={row}
                        column={this.columns_map.indicative}
                    />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={this.columns_map.payout} />
                    <DataList.Cell className='data-list__row-cell--amount' row={row} column={this.columns_map.profit} />
                </div>
            </>
        );
    };

    getRowAction = row_obj =>
        row_obj.is_unsupported
            ? {
                  component: (
                      <Localize
                          i18n_default_text='This trade type is currently not supported on {{website_name}}. Please go to <0>Binary.com</0> for details.'
                          values={{
                              website_name,
                          }}
                          components={[
                              <a
                                  key={0}
                                  className='link link--orange'
                                  rel='noopener noreferrer'
                                  target='_blank'
                                  href={urlFor('user/portfoliows', { legacy: true })}
                              />,
                          ]}
                      />
                  ),
              }
            : getContractPath(row_obj.id);

    // After refactoring transactionHandler for creating positions,
    // purchase property in contract positions object is somehow NaN or undefined in the first few responses.
    // So we set it to true in these cases to show a preloader for the data-table-row until the correct value is set.
    isPurchaseReceived = item => isNaN(item.purchase) || !item.purchase;

    getTotals = (active_positions_filtered, is_multiplier_selected) => {
        let totals;

        if (is_multiplier_selected) {
            let ask_price = 0;
            let profit = 0;
            let buy_price = 0;

            active_positions_filtered.forEach(portfolio_pos => {
                buy_price += +portfolio_pos.purchase;
                if (portfolio_pos.contract_info) {
                    profit += portfolio_pos.contract_info.profit;

                    if (portfolio_pos.contract_info.cancellation) {
                        ask_price += portfolio_pos.contract_info.cancellation.ask_price || 0;
                        buy_price -= portfolio_pos.contract_info.cancellation.ask_price;
                    }
                }
            });
            totals = {
                contract_info: {
                    profit,
                },
                buy_price,
            };

            if (ask_price > 0) {
                totals.contract_info.cancellation = {
                    ask_price,
                };
            }
        } else {
            let indicative = 0;
            let purchase = 0;
            let profit_loss = 0;
            let payout = 0;

            active_positions_filtered.forEach(portfolio_pos => {
                indicative += +portfolio_pos.indicative;
                purchase += +portfolio_pos.purchase;
                profit_loss += portfolio_pos.profit_loss;
                payout += portfolio_pos.payout;
            });
            totals = {
                indicative,
                purchase,
                profit_loss,
                payout,
            };
        }
        return totals;
    };

    setActiveTabIndex = index => {
        this.setState({ active_index: index });
    };

    render() {
        const {
            active_positions,
            component_icon,
            is_loading,
            error,
            is_virtual,
            currency,
            NotificationMessages,
        } = this.props;

        if (error) {
            return <p>{error}</p>;
        }

        const is_multiplier_selected = this.state.active_index === 1;

        const active_positions_filtered = is_virtual
            ? active_positions.filter(p => {
                  if (p.contract_info) {
                      return is_multiplier_selected
                          ? isMultiplierContract(p.contract_info.contract_type)
                          : !isMultiplierContract(p.contract_info.contract_type);
                  }
                  return true;
              })
            : active_positions;

        const active_positions_filtered_totals = this.getTotals(active_positions_filtered, is_multiplier_selected);

        const shared_props = {
            active_positions: active_positions_filtered,
            component_icon,
            currency,
            is_loading,
            mobileRowRenderer: this.mobileRowRenderer,
            getRowAction: this.getRowAction,
            preloaderCheck: this.isPurchaseReceived,
            totals: active_positions_filtered_totals,
        };
        this.columns =
            this.state.active_index === 1 && this.props.is_virtual
                ? getMultiplierOpenPositionsColumnsTemplate(currency)
                : getOpenPositionsColumnsTemplate(currency);

        this.columns_map = this.columns.reduce((map, item) => {
            map[item.col_index] = item;
            return map;
        }, {});

        return (
            <React.Fragment>
                <NotificationMessages />
                <ReportsMeta
                    i18n_heading={localize('Open positions')}
                    i18n_message={localize(
                        'View all active trades on your account that can still incur a profit or a loss.'
                    )}
                />
                {// TODO: remove is_virtual check once Multiplier is available for real accounts
                !is_virtual ? (
                    <OpenPositionsTable className='open-positions' columns={this.columns} {...shared_props} />
                ) : (
                    <Tabs
                        active_index={this.state.active_index}
                        className='open-positions'
                        onTabItemClick={this.setActiveTabIndex}
                        top
                        header_fit_content
                    >
                        <div label={localize('Options')}>
                            <OpenPositionsTable className='open-positions' columns={this.columns} {...shared_props} />
                        </div>
                        <div label={localize('Multiplier options')}>
                            <OpenPositionsTable
                                className='open-positions-multiplier open-positions'
                                columns={this.columns}
                                action_column={this.getActionColumns}
                                {...shared_props}
                            />
                        </div>
                    </Tabs>
                )}
            </React.Fragment>
        );
    }
}

OpenPositions.propTypes = {
    active_positions: MobxPropTypes.arrayOrObservableArray,
    component_icon: PropTypes.string,
    currency: PropTypes.string,
    error: PropTypes.string,
    history: PropTypes.object,
    is_loading: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_tablet: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    server_time: PropTypes.object,
    totals: PropTypes.object,
};

export default connect(({ modules, client, common, ui }) => ({
    currency: client.currency,
    is_virtual: client.is_virtual,
    active_positions: modules.portfolio.active_positions,
    error: modules.portfolio.error,
    getPositionById: modules.portfolio.getPositionById,
    is_loading: modules.portfolio.is_loading,
    onClickCancel: modules.portfolio.onClickCancel,
    onClickSell: modules.portfolio.onClickSell,
    onMount: modules.portfolio.onMount,
    onUnmount: modules.portfolio.onUnmount,
    is_multiplier: modules.trade.is_multiplier,
    NotificationMessages: ui.notification_messages_ui,
    server_time: common.server_time,
}))(withRouter(OpenPositions));
