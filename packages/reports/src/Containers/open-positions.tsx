import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { DataList, usePrevious, SelectNative, Dropdown } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import {
    isAccumulatorContract,
    isMultiplierContract,
    getTotalProfit,
    getGrowthRatePercentage,
    toMoment,
    CONTRACT_STORAGE_VALUES,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import {
    getOpenPositionsColumnsTemplate,
    getAccumulatorOpenPositionsColumnsTemplate,
    getMultiplierOpenPositionsColumnsTemplate,
} from 'Constants/data-table-constants';
import { observer, useStore } from '@deriv/stores';
import { TColIndex } from 'Types';
import { OpenPositionsTable } from './open-positions-table';
import { MobileRowRenderer } from './mobile-row-renderer';
import { getLatestContractType } from '../Constants/contract-types';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];
type TDataListCell = React.ComponentProps<typeof DataList.Cell>;
type TRowRenderer = React.ComponentProps<typeof DataList>['rowRenderer'];

export type TTotals = {
    contract_info?: {
        profit?: number;
        buy_price?: number;
        bid_price?: number;
        cancellation?: {
            ask_price?: number;
        };
        limit_order?: {
            take_profit?: {
                order_amount?: number | null;
            };
        };
    };
    indicative?: number;
    purchase?: number;
    profit_loss?: number;
    payout?: number | null;
};

type TOpenPositions = RouteComponentProps & {
    component_icon: string;
};

const getOpenPositionsTotals = (
    active_positions_filtered: TPortfolioStore['active_positions'],
    is_multiplier_selected: boolean,
    is_accumulator_selected: boolean
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
    } else if (is_accumulator_selected) {
        let buy_price = 0;
        let bid_price = 0;
        let take_profit = 0;
        let profit = 0;

        active_positions_filtered?.forEach(({ contract_info }) => {
            buy_price += Number(contract_info.buy_price);
            bid_price += Number(contract_info.bid_price);
            if (contract_info.limit_order?.take_profit?.order_amount)
                take_profit += contract_info.limit_order.take_profit.order_amount;
            if (contract_info) {
                profit += getTotalProfit(contract_info);
            }
        });
        totals = {
            contract_info: {
                buy_price,
                bid_price,
                profit,
                limit_order: {
                    take_profit: {
                        order_amount: take_profit,
                    },
                },
            },
            purchase: buy_price,
        };
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

const OpenPositions = observer(({ component_icon, ...props }: TOpenPositions) => {
    const { portfolio, client, ui, common, contract_trade } = useStore();
    const {
        active_positions,
        error,
        getPositionById,
        is_loading,
        onClickCancel,
        onClickSell,
        onMount,
        removePositionById: onClickRemove,
    } = portfolio;
    const { currency, is_eu: hide_accu_in_dropdown } = client;
    const {
        notification_messages_ui: NotificationMessages,
        addToast,
        current_focus,
        is_mobile,
        removeToast,
        setCurrentFocus,
        should_show_cancellation_warning,
        toggleCancellationWarning,
    } = ui;
    const { server_time } = common;
    const { getContractById } = contract_trade;

    const store_props = {
        onClickRemove,
        NotificationMessages,
        addToast,
        current_focus,
        is_mobile,
        removeToast,
        setCurrentFocus,
        should_show_cancellation_warning,
        toggleCancellationWarning,
        getContractById,
    };

    const { isDesktop } = useDevice();
    const previous_active_positions = usePrevious(active_positions);

    const generateContractTypes = () => {
        const queryParams = new URLSearchParams(location.search);
        const contract_type_bot = queryParams.get('contract_type_bots');
        const default_contract_type = getLatestContractType(active_positions);

        if (!contract_type_bot) {
            return [
                {
                    text: localize('Options'),
                    value: CONTRACT_STORAGE_VALUES.OPTIONS,
                    is_default: default_contract_type === CONTRACT_STORAGE_VALUES.OPTIONS,
                },
                {
                    text: localize('Multipliers'),
                    value: CONTRACT_STORAGE_VALUES.MULTIPLIERS,
                    is_default: default_contract_type === CONTRACT_STORAGE_VALUES.MULTIPLIERS,
                },
                {
                    text: localize('Accumulators'),
                    value: CONTRACT_STORAGE_VALUES.ACCUMULATORS,
                    is_default: default_contract_type === CONTRACT_STORAGE_VALUES.ACCUMULATORS,
                },
            ];
        }

        const is_multiplier_bot = contract_type_bot === 'trade_definition_multiplier';
        const is_accumulator_bot = contract_type_bot === 'trade_definition_accumulator';

        const contract_types = [
            {
                text: localize('Options'),
                value: CONTRACT_STORAGE_VALUES.OPTIONS,
                is_default: !is_multiplier_bot && !is_accumulator_bot,
            },
            {
                text: localize('Multipliers'),
                value: CONTRACT_STORAGE_VALUES.MULTIPLIERS,
                is_default: is_multiplier_bot,
            },
            {
                text: localize('Accumulators'),
                value: CONTRACT_STORAGE_VALUES.ACCUMULATORS,
                is_default: is_accumulator_bot,
            },
        ];
        return contract_types;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const contract_types = React.useMemo(() => generateContractTypes(), [previous_active_positions]);

    const [contract_type_value, setContractTypeValue] = React.useState(() => {
        const stored_value = sessionStorage.getItem('contract_type_value');
        // Check if the stored value is valid
        if (stored_value && Object.values(CONTRACT_STORAGE_VALUES).includes(stored_value)) {
            return stored_value;
        }
        return contract_types.find(type => type.is_default)?.value || 'options';
    });
    const prev_contract_type_value = usePrevious(contract_type_value);
    const accumulator_rates = [
        { text: localize('All growth rates'), value: 'all growth rates' },
        { text: '1%', value: '1%' },
        { text: '2%', value: '2%' },
        { text: '3%', value: '3%' },
        { text: '4%', value: '4%' },
        { text: '5%', value: '5%' },
    ];
    const [accumulator_rate, setAccumulatorRate] = React.useState(accumulator_rates[0].value);
    const prev_accumulator_rate = usePrevious(accumulator_rate);
    const is_accumulator_selected = contract_type_value === contract_types[2].value;
    const is_multiplier_selected = contract_type_value === contract_types[1].value;
    const contract_types_list = contract_types
        .filter(contract_type => contract_type.value !== 'accumulators' || !hide_accu_in_dropdown)
        .map(({ text, value }) => ({ text, value }));
    const active_positions_filtered = active_positions?.filter(({ contract_info }) => {
        if (contract_info) {
            if (is_multiplier_selected) return isMultiplierContract(contract_info.contract_type || '');
            if (is_accumulator_selected)
                return (
                    isAccumulatorContract(contract_info.contract_type) &&
                    (`${getGrowthRatePercentage(Number(contract_info.growth_rate))}%` === accumulator_rate ||
                        !accumulator_rate.includes('%'))
                );
            return (
                !isMultiplierContract(contract_info.contract_type || '') &&
                !isAccumulatorContract(contract_info.contract_type)
            );
        }
        return true;
    });
    const active_positions_filtered_totals = getOpenPositionsTotals(
        active_positions_filtered,
        is_multiplier_selected,
        is_accumulator_selected
    );

    React.useEffect(() => {
        /*
         * For mobile, we show portfolio stepper in header even for reports pages.
         * `onMount` in portfolio store will be invoked from portfolio stepper component in `trade-header-extensions.jsx`
         */

        onMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (prev_contract_type_value) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_trade_type',
                form_name: 'default',
                subform_name: 'open_positions_form',
                trade_type_filter: contract_type_value,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract_type_value]);

    React.useEffect(() => {
        if (prev_accumulator_rate) {
            Analytics.trackEvent('ce_reports_form', {
                action: 'filter_growth_rate',
                form_name: 'default',
                subform_name: 'open_positions_form',
                growth_type_filter: accumulator_rate,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accumulator_rate]);

    if (error) return <p>{error}</p>;

    const getColumns = () => {
        if (is_multiplier_selected && server_time) {
            return getMultiplierOpenPositionsColumnsTemplate({
                currency,
                onClickCancel,
                onClickSell,
                getPositionById,
                server_time,
                isDesktop,
            });
        }
        if (is_accumulator_selected) {
            return getAccumulatorOpenPositionsColumnsTemplate({
                currency,
                onClickSell,
                getPositionById,
                isDesktop,
            });
        }
        return getOpenPositionsColumnsTemplate(currency, isDesktop);
    };

    const columns = getColumns();

    const columns_map = {} as Record<TColIndex, TDataListCell['column']>;
    columns.forEach(e => {
        columns_map[e.col_index as TColIndex] = e as TDataListCell['column'];
    });

    const mobileRowRenderer: TRowRenderer = args => (
        <MobileRowRenderer
            {...args}
            columns_map={columns_map}
            server_time={server_time || toMoment()}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            {...props}
            {...store_props}
        />
    );

    const shared_props = {
        accumulator_rate,
        active_positions: active_positions_filtered,
        component_icon,
        contract_type_value,
        currency,
        is_loading,
        mobileRowRenderer,
        totals: active_positions_filtered_totals,
    };

    const getOpenPositionsTable = () => {
        let classname = 'open-positions';
        let row_size = isDesktop ? 63 : 5;

        if (is_accumulator_selected) {
            classname = 'open-positions-accumulator open-positions';
            row_size = isDesktop ? 68 : 3;
        } else if (is_multiplier_selected) {
            classname = 'open-positions-multiplier open-positions';
            row_size = isDesktop ? 68 : 3;
        }

        return (
            <OpenPositionsTable
                className={classname}
                columns={columns}
                is_empty={active_positions_filtered.length === 0}
                row_size={row_size}
                {...shared_props}
            />
        );
    };

    return (
        <React.Fragment>
            <NotificationMessages />
            {active_positions.length !== 0 &&
                (isDesktop ? (
                    <div
                        className={
                            is_accumulator_selected
                                ? 'open-positions__accumulator-container'
                                : 'open-positions__contract-types-selector-container'
                        }
                    >
                        <div className='open-positions__accumulator-container__contract-dropdown'>
                            <Dropdown
                                is_align_text_left
                                name='contract_types'
                                list={contract_types_list}
                                value={contract_type_value}
                                onChange={e => {
                                    setContractTypeValue(e.target.value);
                                    sessionStorage.setItem('contract_type_value', e.target.value);
                                }}
                            />
                        </div>
                        {is_accumulator_selected && !hide_accu_in_dropdown && (
                            <div className='open-positions__accumulator-container__rates-dropdown'>
                                <Dropdown
                                    is_align_text_left
                                    name='accumulator_rates'
                                    list={accumulator_rates}
                                    value={accumulator_rate}
                                    onChange={e => setAccumulatorRate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className={
                            is_accumulator_selected
                                ? 'open-positions__accumulator-container--mobile'
                                : 'open-positions__contract-types-selector-container--mobile'
                        }
                    >
                        <SelectNative
                            className='open-positions__accumulator-container-mobile__contract-dropdown'
                            list_items={contract_types_list}
                            value={contract_type_value}
                            should_show_empty_option={false}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement> & { target: { value: string } }) => {
                                setContractTypeValue(e.target.value);
                                sessionStorage.setItem('contract_type_value', e.target.value);
                            }}
                        />
                        {is_accumulator_selected && !hide_accu_in_dropdown && (
                            <SelectNative
                                className='open-positions__accumulator-container--mobile__rates-dropdown'
                                list_items={accumulator_rates}
                                value={accumulator_rate}
                                should_show_empty_option={false}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement> & { target: { value: string } }) =>
                                    setAccumulatorRate(e.target.value)
                                }
                            />
                        )}
                    </div>
                ))}
            {getOpenPositionsTable()}
        </React.Fragment>
    );
});

export default withRouter(OpenPositions);
