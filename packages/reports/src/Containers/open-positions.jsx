import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    DesktopWrapper,
    MobileWrapper,
    ProgressBar,
    DataList,
    DataTable,
    ContractCard,
    usePrevious,
    PositionsDrawerCard,
    Dropdown,
    SelectNative,
} from '@deriv/components';
import {
    urlFor,
    isMobile,
    isMultiplierContract,
    getTimePercentage,
    website_name,
    getTotalProfit,
    getContractPath,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import { getContractDurationType } from '../Helpers/market-underlying';

import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message.jsx';
import {
    getOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate,
} from 'Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component.jsx';
import { getCardLabels } from '_common/contract';
import { connect } from 'Stores/connect';

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

const MobileRowRenderer = ({
    row,
    is_footer,
    columns_map,
    server_time,
    onClickCancel,
    onClickSell,
    measure,
    ...props
}) => {
    React.useEffect(() => {
        if (!is_footer) {
            measure();
        }
    }, [row.contract_info?.underlying, measure, is_footer]);

    if (is_footer) {
        return (
            <>
                <div className='open-positions__data-list-footer--content'>
                    <div>
                        <DataList.Cell row={row} column={columns_map.purchase} />
                        <DataList.Cell row={row} column={columns_map.payout} />
                    </div>
                    <div>
                        <DataList.Cell
                            className='data-list__row-cell--amount'
                            row={row}
                            column={columns_map.indicative}
                        />
                        <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.profit} />
                    </div>
                </div>
            </>
        );
    }

    const { contract_info, contract_update, type, is_sell_requested } = row;
    const { currency, status, date_expiry, date_start } = contract_info;
    const duration_type = getContractDurationType(contract_info.longcode);
    const progress_value = getTimePercentage(server_time, date_start, date_expiry) / 100;

    if (isMultiplierContract(type)) {
        return (
            <PositionsDrawerCard
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
                is_multiplier
                is_link_disabled
                onClickCancel={onClickCancel}
                onClickSell={onClickSell}
                server_time={server_time}
                status={status}
                {...props}
            />
        );
    }

    return (
        <>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.type} />
                <ProgressBar label={duration_type} value={progress_value} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.reference} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.currency} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.purchase} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.indicative} />
            </div>
            <div className='data-list__row'>
                <DataList.Cell row={row} column={columns_map.payout} />
                <DataList.Cell className='data-list__row-cell--amount' row={row} column={columns_map.profit} />
            </div>
            <div className='data-list__row-divider' />
            <div className='data-list__row'>
                <ContractCard.Sell
                    contract_info={contract_info}
                    is_sell_requested={is_sell_requested}
                    getCardLabels={getCardLabels}
                    onClickSell={onClickSell}
                />
            </div>
        </>
    );
};

export const OpenPositionsTable = ({
    className,
    columns,
    component_icon,
    currency,
    active_positions,
    is_loading,
    getRowAction,
    mobileRowRenderer,
    preloaderCheck,
    row_size,
    totals,
    is_empty,
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
                <div className='reports__content'>
                    <DesktopWrapper>
                        <EmptyPlaceholderWrapper component_icon={component_icon} is_empty={is_empty}>
                            <DataTable
                                className={className}
                                columns={columns}
                                preloaderCheck={preloaderCheck}
                                footer={totals}
                                data_source={active_positions}
                                getRowAction={getRowAction}
                                getRowSize={() => row_size}
                                content_loader={ReportsTableRowLoader}
                            >
                                <PlaceholderComponent is_loading={is_loading} />
                            </DataTable>
                        </EmptyPlaceholderWrapper>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <EmptyPlaceholderWrapper component_icon={component_icon} is_empty={is_empty}>
                            <DataList
                                className={className}
                                data_source={active_positions}
                                footer={totals}
                                rowRenderer={mobileRowRenderer}
                                getRowAction={getRowAction}
                                row_gap={8}
                                keyMapper={item => item?.id}
                            >
                                <PlaceholderComponent is_loading={is_loading} />
                            </DataList>
                        </EmptyPlaceholderWrapper>
                    </MobileWrapper>
                </div>
            )
        )}
    </React.Fragment>
);

const getRowAction = row_obj =>
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

/*
 * After refactoring transactionHandler for creating positions,
 * purchase property in contract positions object is somehow NaN or undefined in the first few responses.
 * So we set it to true in these cases to show a preloader for the data-table-row until the correct value is set.
 */
const isPurchaseReceived = item => isNaN(item.purchase) || !item.purchase;

const getOpenPositionsTotals = (active_positions_filtered, is_multiplier_selected) => {
    let totals;

    if (is_multiplier_selected) {
        let ask_price = 0;
        let profit = 0;
        let buy_price = 0;
        let bid_price = 0;
        let purchase = 0;

        active_positions_filtered.forEach(portfolio_pos => {
            buy_price += +portfolio_pos.contract_info.buy_price;
            bid_price += +portfolio_pos.contract_info.bid_price;
            purchase += +portfolio_pos.purchase;
            if (portfolio_pos.contract_info) {
                profit += getTotalProfit(portfolio_pos.contract_info);

                if (portfolio_pos.contract_info.cancellation) {
                    ask_price += portfolio_pos.contract_info.cancellation.ask_price || 0;
                }
            }
        });
        totals = {
            contract_info: {
                profit,
                buy_price,
                bid_price,
            },
            purchase,
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

        active_positions_filtered?.forEach(portfolio_pos => {
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

const OpenPositions = ({
    active_positions,
    component_icon,
    currency,
    error,
    getPositionById,
    is_loading,
    is_multiplier,
    NotificationMessages,
    onClickCancel,
    onClickSell,
    onMount,
    server_time,
    ...props
}) => {
    const [has_multiplier_contract, setMultiplierContract] = React.useState(false);
    const [contract_type_value, setContractTypeValue] = React.useState(is_multiplier ? 'Multipliers' : 'Options');
    const previous_active_positions = usePrevious(active_positions);
    const contract_types = [
        {
            text: localize('Options'),
            value: 'Options',
        },
        {
            text: localize('Multipliers'),
            value: 'Multipliers',
        },
    ];

    React.useEffect(() => {
        /*
         * For mobile, we show portfolio stepper in header even for reports pages.
         * `onMount` in portfolio store will be invoked from portfolio stepper component in `trade-header-extensions.jsx`
         */

        onMount();
        checkForMultiplierContract();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        checkForMultiplierContract(previous_active_positions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previous_active_positions]);

    const checkForMultiplierContract = (prev_active_positions = []) => {
        if (!has_multiplier_contract && active_positions !== prev_active_positions) {
            setMultiplierContract(active_positions.some(p => isMultiplierContract(p.contract_info?.contract_type)));
        }
    };

    if (error) return <p>{error}</p>;

    const is_multiplier_selected = contract_type_value === 'Multipliers';
    const is_options_selected = contract_type_value === 'Options';

    const active_positions_filtered = active_positions?.filter(p => {
        if (p.contract_info) {
            return is_multiplier_selected
                ? isMultiplierContract(p.contract_info.contract_type)
                : !isMultiplierContract(p.contract_info.contract_type);
        }
        return true;
    });

    const active_positions_filtered_totals = getOpenPositionsTotals(active_positions_filtered, is_multiplier_selected);

    const columns = is_multiplier_selected
        ? getMultiplierOpenPositionsColumnsTemplate({
              currency,
              onClickCancel,
              onClickSell,
              getPositionById,
              server_time,
          })
        : getOpenPositionsColumnsTemplate(currency);

    const columns_map = columns.reduce((map, item) => {
        map[item.col_index] = item;
        return map;
    }, {});

    const mobileRowRenderer = args => (
        <MobileRowRenderer
            {...args}
            columns_map={columns_map}
            server_time={server_time}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            {...props}
        />
    );

    const shared_props = {
        active_positions: active_positions_filtered,
        component_icon,
        currency,
        is_loading,
        mobileRowRenderer,
        getRowAction,
        preloaderCheck: isPurchaseReceived,
        totals: active_positions_filtered_totals,
    };

    const handleChange = e => {
        setContractTypeValue(e.target.value);
    };

    return (
        <React.Fragment>
            <NotificationMessages />
            {active_positions.length !== 0 && (
                <React.Fragment>
                    <DesktopWrapper>
                        <div className='open-positions__contract-types-selector__container'>
                            <Dropdown
                                is_align_text_left
                                name='contract_types'
                                list={contract_types}
                                value={contract_type_value}
                                onChange={handleChange}
                            />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <SelectNative
                            className='open-positions__contract-types-selector'
                            list_items={contract_types.map(option => ({
                                text: option.text,
                                value: option.value,
                            }))}
                            value={contract_type_value}
                            should_show_empty_option={false}
                            onChange={handleChange}
                        />
                    </MobileWrapper>
                </React.Fragment>
            )}

            {is_options_selected ? (
                <OpenPositionsTable
                    is_empty={active_positions_filtered.length === 0}
                    className='open-positions'
                    columns={columns}
                    {...shared_props}
                    row_size={isMobile() ? 5 : 63}
                />
            ) : (
                <OpenPositionsTable
                    className='open-positions-multiplier open-positions'
                    columns={columns}
                    row_size={isMobile() ? 3 : 68}
                    is_empty={active_positions_filtered.length === 0}
                    {...shared_props}
                />
            )}
        </React.Fragment>
    );
};

OpenPositions.propTypes = {
    active_positions: MobxPropTypes.arrayOrObservableArray,
    component_icon: PropTypes.string,
    currency: PropTypes.string,
    error: PropTypes.string,
    getPositionById: PropTypes.func,
    is_loading: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    NotificationMessages: PropTypes.func,
    onClickCancel: PropTypes.func,
    onClickSell: PropTypes.func,
    onMount: PropTypes.func,
    server_time: PropTypes.object,
    addToast: PropTypes.func,
    current_focus: PropTypes.string,
    onClickRemove: PropTypes.func,
    getContractById: PropTypes.func,
    is_mobile: PropTypes.bool,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    should_show_cancellation_warning: PropTypes.bool,
    toggleCancellationWarning: PropTypes.func,
    toggleUnsupportedContractModal: PropTypes.func,
};

export default connect(({ client, common, ui, portfolio, contract_trade }) => ({
    active_positions: portfolio.active_positions,
    currency: client.currency,
    error: portfolio.error,
    getPositionById: portfolio.getPositionById,
    is_loading: portfolio.is_loading,
    is_multiplier: portfolio.is_multiplier,
    NotificationMessages: ui.notification_messages_ui,
    onClickCancel: portfolio.onClickCancel,
    onClickSell: portfolio.onClickSell,
    onMount: portfolio.onMount,
    server_time: common.server_time,
    addToast: ui.addToast,
    current_focus: ui.current_focus,
    onClickRemove: portfolio.removePositionById,
    getContractById: contract_trade.getContractById,
    is_mobile: ui.is_mobile,
    removeToast: ui.removeToast,
    setCurrentFocus: ui.setCurrentFocus,
    should_show_cancellation_warning: ui.should_show_cancellation_warning,
    toggleCancellationWarning: ui.toggleCancellationWarning,
    toggleUnsupportedContractModal: ui.toggleUnsupportedContractModal,
}))(withRouter(OpenPositions));
