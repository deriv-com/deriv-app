import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    DesktopWrapper,
    MobileWrapper,
    ProgressBar,
    Tabs,
    DataList,
    DataTable,
    ContractCard,
    usePrevious,
    PositionsDrawerCard,
} from '@deriv/components';
import {
    urlFor,
    isMobile,
    isMultiplierContract,
    getTimePercentage,
    website_name,
    getTotalProfit,
    getContractPath,
    formatPortfolioPosition,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { ReportsTableRowLoader } from '../Components/Elements/ContentLoader';
import { getContractDurationType } from '../Helpers/market-underlying';

import EmptyTradeHistoryMessage from '../Components/empty-trade-history-message';
import {
    getOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate,
} from 'Constants/data-table-constants';
import PlaceholderComponent from '../Components/placeholder-component';
import { getCardLabels } from '_common/contract';
import { connect } from 'Stores/connect';
import type { TRootStore } from 'Stores/index';
import { TContractInfo } from '@deriv/shared/src/utils/contract/contract-types';

type TRangeFloatZeroToOne = React.ComponentProps<typeof ProgressBar>['value'];
type TFormatPortfolioPosition = ReturnType<typeof formatPortfolioPosition>;
type TGetMultiplierOpenPositionsColumnsTemplate = ReturnType<typeof getMultiplierOpenPositionsColumnsTemplate>;
type TGetOpenPositionsColumnsTemplate = ReturnType<typeof getOpenPositionsColumnsTemplate>;
type TColumnsMap = TGetMultiplierOpenPositionsColumnsTemplate | TGetOpenPositionsColumnsTemplate;
type TColumnsMapElement = TColumnsMap[number];
type TColIndex =
    | 'type'
    | 'reference'
    | 'currency'
    | 'purchase'
    | 'payout'
    | 'profit'
    | 'indicative'
    | 'id'
    | 'multiplier'
    | 'buy_price'
    | 'cancellation'
    | 'limit_order'
    | 'bid_price'
    | 'action';

type TEmptyPlaceholderWrapper = React.PropsWithChildren<{
    is_empty: boolean;
    component_icon: string;
}>;

const EmptyPlaceholderWrapper = ({ is_empty, component_icon, children }: TEmptyPlaceholderWrapper) => (
    <React.Fragment>
        {is_empty ? (
            <PlaceholderComponent
                is_empty={is_empty}
                empty_message_component={EmptyTradeHistoryMessage}
                component_icon={component_icon}
                localized_message={localize('You have no open positions yet.')}
            />
        ) : (
            children
        )}
    </React.Fragment>
);

type TMobileRowRenderer = {
    row: TFormatPortfolioPosition & { is_sell_requested: boolean };
    is_footer: boolean;
    columns_map: Record<TColIndex, TColumnsMapElement>;
    server_time: moment.Moment;
    onClickCancel: () => void;
    onClickSell: () => void;
    measure: () => void;
};

type TOpenPositionsTable = {
    className: string;
    columns: Record<string, any>[];
    component_icon: string;
    currency: string;
    active_positions: TFormatPortfolioPosition[];
    is_loading: boolean;
    getRowAction: (row_obj: TRowObj) =>
        | string
        | {
              component: JSX.Element;
          };
    mobileRowRenderer: (args: TMobileRowRenderer) => JSX.Element;
    preloaderCheck: (item: { purchase: number }) => boolean;
    row_size: number;
    totals: TTotals;
};

type TRowObj = {
    is_unsupported: false;
    id: number;
};

type TTotals = {
    contract_info?: {
        profit?: number;
        buy_price?: number;
        bid_price?: number;
        cancellation?: {
            ask_price?: number;
        };
    };
    indicative?: number;
    purchase?: number;
    profit_loss?: number;
    payout?: number;
};

type TAddToastProps = {
    key: string;
    content: string;
    type: string;
};

type TOpenPositions = {
    active_positions: TFormatPortfolioPosition[];
    component_icon: string;
    currency: string;
    error: string;
    getPositionById: (id: number) => TFormatPortfolioPosition;
    is_loading: boolean;
    is_multiplier: boolean;
    NotificationMessages: () => JSX.Element;
    onClickCancel: () => void;
    onClickSell: () => void;
    onMount: () => void;
    server_time: moment.Moment;
    addToast: (obj: TAddToastProps) => void;
    current_focus: string;
    onClickRemove: () => void;
    getContractById: (id: number) => TContractInfo;
    is_mobile: boolean;
    removeToast: () => void;
    setCurrentFocus: () => void;
    should_show_cancellation_warning: boolean;
    toggleCancellationWarning: () => void;
    toggleUnsupportedContractModal: () => void;
};

const MobileRowRenderer = ({
    row,
    is_footer,
    columns_map,
    server_time,
    onClickCancel,
    onClickSell,
    measure,
    ...props
}: TMobileRowRenderer) => {
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
    const progress_value = (getTimePercentage(server_time, date_start ?? 0, date_expiry ?? 0) /
        100) as TRangeFloatZeroToOne;

    if (isMultiplierContract(type ?? '')) {
        return (
            <PositionsDrawerCard
                contract_info={contract_info}
                contract_update={contract_update}
                currency={currency}
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
}: TOpenPositionsTable) => (
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
                                getRowAction={getRowAction}
                                getRowSize={() => row_size}
                                content_loader={ReportsTableRowLoader}
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
                                row_gap={8}
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

const getRowAction = (row_obj: TRowObj) =>
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
const isPurchaseReceived = (item: { purchase: number }) => isNaN(item.purchase) || !item.purchase;

const getOpenPositionsTotals = (
    active_positions_filtered: TFormatPortfolioPosition[],
    is_multiplier_selected: boolean
) => {
    let totals: TTotals;

    if (is_multiplier_selected) {
        let ask_price = 0;
        let profit = 0;
        let buy_price = 0;
        let bid_price = 0;
        let purchase = 0;

        active_positions_filtered.forEach(portfolio_pos => {
            buy_price += Number(portfolio_pos.contract_info.buy_price);
            bid_price += Number(portfolio_pos.contract_info.bid_price);
            purchase += Number(portfolio_pos.purchase);
            if (portfolio_pos.contract_info) {
                const prices = {
                    bid_price: portfolio_pos.contract_info.bid_price ?? 0,
                    buy_price: portfolio_pos.contract_info.buy_price ?? 0,
                };
                profit += getTotalProfit(prices);

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
            if (totals.contract_info)
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
            purchase += Number(portfolio_pos.purchase);
            profit_loss += Number(portfolio_pos.profit_loss);
            payout += Number(portfolio_pos.payout);
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
}: TOpenPositions) => {
    const [active_index, setActiveIndex] = React.useState(is_multiplier ? 1 : 0);
    // Tabs should be visible only when there is at least one active multiplier contract
    const [has_multiplier_contract, setMultiplierContract] = React.useState(false);
    const previous_active_positions = usePrevious(active_positions);

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

    const checkForMultiplierContract = (prev_active_positions: TFormatPortfolioPosition[] = []) => {
        if (!has_multiplier_contract && active_positions !== prev_active_positions) {
            setMultiplierContract(
                active_positions.some(p => isMultiplierContract(p.contract_info?.contract_type ?? ''))
            );
        }
    };

    const setActiveTabIndex = (index: number) => setActiveIndex(index);

    if (error) return <p>{error}</p>;

    const is_multiplier_selected = has_multiplier_contract && active_index === 1;
    const active_positions_filtered = active_positions?.filter(p => {
        if (p.contract_info) {
            return is_multiplier_selected
                ? isMultiplierContract(p.contract_info.contract_type ?? '')
                : !isMultiplierContract(p.contract_info.contract_type ?? '');
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

    const columns_map = {} as Record<string, TColumnsMapElement>;
    columns.forEach(e => {
        columns_map[e.col_index] = e;
    });

    const mobileRowRenderer = (args: TMobileRowRenderer) => (
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

    return (
        <React.Fragment>
            <NotificationMessages />
            {has_multiplier_contract ? (
                <Tabs
                    active_index={active_index}
                    className='open-positions'
                    onTabItemClick={setActiveTabIndex}
                    top
                    header_fit_content={!isMobile()}
                    bottom={false}
                    active_icon_color={''}
                    background_color={''}
                    center={false}
                    fit_content={false}
                    icon_color={''}
                    icon_size={0}
                    is_100vw={false}
                    is_full_width={false}
                    is_overflow_hidden={false}
                    is_scrollable={false}
                    should_update_hash={false}
                    single_tab_has_no_label={false}
                >
                    <div aria-label={localize('Options')}>
                        <OpenPositionsTable
                            className='open-positions'
                            columns={columns}
                            {...shared_props}
                            row_size={isMobile() ? 5 : 63}
                        />
                    </div>
                    <div aria-label={localize('Multipliers')}>
                        <OpenPositionsTable
                            className='open-positions-multiplier open-positions'
                            columns={columns}
                            row_size={isMobile() ? 3 : 68}
                            {...shared_props}
                        />
                    </div>
                </Tabs>
            ) : (
                <OpenPositionsTable
                    className='open-positions'
                    columns={columns}
                    {...shared_props}
                    row_size={isMobile() ? 5 : 63}
                />
            )}
        </React.Fragment>
    );
};

export default withRouter(
    connect(({ client, common, ui, portfolio, contract_trade }: TRootStore) => ({
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
    }))(OpenPositions)
);
