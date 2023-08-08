import classNames from 'classnames';
import React from 'react';
import { Icon, Label, Money, ContractCard, ContractCardSell, Popover } from '@deriv/components';
import {
    getCurrencyDisplayCode,
    getTotalProfit,
    shouldShowCancellation,
    getGrowthRatePercentage,
    getCardLabels,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import ProgressSliderStream from '../Containers/progress-slider-stream';
import { TCellContentProps } from 'Types';
import { getProfitOrLoss } from '../Helpers/profit-loss';
import IndicativeCell from '../Components/indicative-cell';
import MarketSymbolIconRow from '../Components/market-symbol-icon-row';
import ProfitLossCell from '../Components/profit_loss_cell';
import CurrencyWrapper from '../Components/currency-wrapper';
import { ITransformer } from 'mobx-utils';

export const map = {
    buy: 'success',
    deposit: 'success',
    hold: 'warn',
    release: 'success',
    sell: 'danger',
    withdrawal: 'info',
    default: 'default',
    adjustment: 'adjustment',
    transfer: 'transfer',
} as const;

export type TKeys = keyof typeof map;

export const getModeFromValue = (key: TKeys) => map[key] || map.default;

export type TMultiplierOpenPositionstemplateProps = {
    currency: string;
    onClickCancel: () => void;
    onClickSell: () => void;
    getPositionById: (id: string) => ITransformer<any, any>;
    server_time: moment.Moment;
};

/* eslint-disable react/display-name, react/prop-types */
export const StatementTableCells = {
    icon: ({ passthrough, row_obj }: TCellContentProps) => {
        const icon = passthrough.isTopUp(row_obj) ? 'icCashierTopUp' : null;
        return <MarketSymbolIconRow icon={icon} key={row_obj.transaction_id} payload={row_obj} />;
    },
    refid: ({ cell_value, row_obj }: TCellContentProps) => {
        return (
            <Popover
                alignment={'top'}
                message={localize('Transaction performed by (App ID: {{app_id}})', { app_id: row_obj.app_id })}
            >
                {cell_value}
            </Popover>
        );
    },
    currency: (currency: string) => () => <CurrencyWrapper currency={getCurrencyDisplayCode(currency)} />,
    date: ({ cell_value }: TCellContentProps) => {
        return <span>{cell_value} GMT</span>;
    },
    action_type: ({ cell_value, passthrough, row_obj }: TCellContentProps) => (
        <Label mode={getModeFromValue(cell_value)}>
            {(passthrough.isTopUp(row_obj) && localize('Top up')) || row_obj.action}
        </Label>
    ),
    amount:
        (currency: string) =>
        ({ cell_value }: TCellContentProps) =>
            (
                <div className={`amount--${getProfitOrLoss(cell_value)}`}>
                    <Money has_sign amount={cell_value.replace(/[,]+/g, '')} currency={currency} />
                </div>
            ),
    balance:
        (currency: string) =>
        ({ cell_value }: TCellContentProps) =>
            <Money amount={cell_value.replace(/[,]+/g, '')} currency={currency} />,
};

export const ProfitTableCell = {
    action_type:
        (items_count: number) =>
        ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return localize('Profit/loss on the last {{item_count}} contracts', { item_count: items_count });
            }
            return <MarketSymbolIconRow key={row_obj.transaction_id} payload={row_obj} />;
        },
    currency:
        (currency: string) =>
        ({ is_footer }: TCellContentProps) => {
            return is_footer ? '' : <CurrencyWrapper currency={getCurrencyDisplayCode(currency)} />;
        },
    purchase_time: ({ cell_value, is_footer }: TCellContentProps) => {
        if (is_footer) return '';
        return <span>{cell_value} GMT</span>;
    },
    buy_price:
        (currency: string) =>
        ({ cell_value, is_footer }: TCellContentProps) => {
            if (is_footer) return '';

            return <Money amount={cell_value} currency={currency} />;
        },
    sell_time: ({ cell_value, is_footer }: TCellContentProps) => {
        if (is_footer) return '';
        return <span>{cell_value} GMT</span>;
    },
    sell_price:
        (currency: string) =>
        ({ cell_value, is_footer }: TCellContentProps) => {
            if (is_footer) return '';

            return <Money amount={cell_value} currency={currency} />;
        },
    profit_loss:
        (currency: string) =>
        ({ cell_value }: TCellContentProps) =>
            (
                <ProfitLossCell value={cell_value}>
                    <Money has_sign amount={cell_value.replace(',', '')} currency={currency} />
                </ProfitLossCell>
            ),
};

export const OpenPositionsCell = {
    type: ({ row_obj, is_footer, is_vanilla }: TCellContentProps) => {
        if (is_footer) return localize('Total');

        return (
            <MarketSymbolIconRow
                key={row_obj.id}
                payload={row_obj.contract_info}
                show_description={is_vanilla}
                is_vanilla={is_vanilla}
            />
        );
    },
    currency: ({ row_obj }: TCellContentProps) => (
        <CurrencyWrapper currency={getCurrencyDisplayCode(row_obj.contract_info?.currency)} />
    ),
    purchase:
        (currency: string) =>
        ({ cell_value }: TCellContentProps) =>
            <Money amount={cell_value} currency={currency} />,
    payout:
        (currency: string) =>
        ({ cell_value, row_obj, is_vanilla }: TCellContentProps) => {
            const non_vanilla_payout = cell_value ? <Money amount={cell_value} currency={currency} /> : <span>-</span>;
            return is_vanilla ? row_obj.barrier?.toFixed(2) : non_vanilla_payout;
        },
    profit:
        (currency: string) =>
        ({ row_obj }: TCellContentProps) => {
            if (!row_obj.profit_loss && !row_obj?.contract_info?.profit) return;
            const profit = row_obj.profit_loss || row_obj.contract_info.profit;
            // eslint-disable-next-line consistent-return
            return (
                <div
                    className={classNames('open-positions__profit-loss', {
                        'open-positions__profit-loss--negative': profit < 0,
                        'open-positions__profit-loss--positive': profit > 0,
                    })}
                >
                    <Money amount={Math.abs(profit)} currency={currency} />
                    <div className='open-positions__profit-loss--movement'>
                        {profit > 0 ? <Icon icon='IcProfit' /> : <Icon icon='IcLoss' />}
                    </div>
                </div>
            );
        },
    indicative:
        (currency: string) =>
        ({ cell_value, row_obj, is_footer }: TCellContentProps) =>
            (
                <IndicativeCell
                    amount={+cell_value}
                    currency={currency}
                    contract_info={row_obj.contract_info}
                    is_sell_requested={row_obj.is_sell_requested}
                    is_footer={is_footer}
                />
            ),
    id: ({ row_obj }: TCellContentProps) => <ProgressSliderStream contract_info={row_obj.contract_info} />,
};

export const MultiplierOpenPositionsCell = {
    type: ({ row_obj, is_footer }: TCellContentProps) => {
        if (is_footer) return localize('Total');

        return <MarketSymbolIconRow key={row_obj.id} payload={row_obj.contract_info} should_show_multiplier={false} />;
    },
    action: ({ getPositionById, onClickCancel, onClickSell, server_time }: TMultiplierOpenPositionstemplateProps) => {
        return ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return <div className='open-positions__row-action' />;
            }

            const { contract_info } = row_obj;
            const position = getPositionById(contract_info.contract_id);
            const { is_sell_requested } = position || {};

            return (
                <div className='open-positions__row-action'>
                    <ContractCard.MultiplierCloseActions
                        contract_info={contract_info}
                        getCardLabels={getCardLabels}
                        is_sell_requested={is_sell_requested}
                        onClickCancel={onClickCancel}
                        onClickSell={onClickSell}
                        server_time={server_time}
                    />
                </div>
            );
        };
    },
    profit:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            if (!row_obj?.contract_info?.profit) return null;
            const total_profit = getTotalProfit(row_obj.contract_info);
            // eslint-disable-next-line consistent-return
            return (
                <div
                    className={classNames('open-positions__profit-loss', {
                        'open-positions__profit-loss--negative': total_profit < 0,
                        'open-positions__profit-loss--positive': total_profit > 0,
                    })}
                >
                    <Money amount={Math.abs(total_profit)} currency={currency} />
                    <div className='open-positions__profit-loss--movement'>
                        {total_profit > 0 ? <Icon icon='IcProfit' /> : <Icon icon='IcLoss' />}
                    </div>
                </div>
            );
        },
    currency: ({ row_obj }: TCellContentProps) => (
        <CurrencyWrapper currency={getCurrencyDisplayCode(row_obj.contract_info?.currency)} />
    ),
    bid_price:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return '';
            }

            if (!row_obj?.contract_info?.bid_price) return '-';

            const total_profit = getTotalProfit(row_obj.contract_info);
            return (
                <div
                    className={classNames('open-positions__bid_price', {
                        'open-positions__bid_price--negative': total_profit < 0,
                        'open-positions__bid_price--positive': total_profit > 0,
                    })}
                >
                    <Money amount={row_obj.contract_info.bid_price} currency={currency} />
                </div>
            );
        },
    purchase:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ cell_value }: TCellContentProps) =>
            <Money amount={cell_value} currency={currency} />,
    limit_order:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return '';
            }

            const { take_profit, stop_loss } = row_obj.contract_info?.limit_order ?? {};
            return (
                <React.Fragment>
                    <div>
                        {take_profit?.order_amount ? (
                            <Money has_sign amount={take_profit.order_amount} currency={currency} />
                        ) : (
                            '-'
                        )}
                    </div>
                    <div>
                        {stop_loss?.order_amount ? (
                            <Money has_sign amount={stop_loss.order_amount} currency={currency} />
                        ) : (
                            '-'
                        )}
                    </div>
                </React.Fragment>
            );
        },
    cancellation:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            if (!row_obj?.contract_info?.underlying) return '-';

            if (!shouldShowCancellation(row_obj.contract_info.underlying)) return localize('N/A');

            if (row_obj.contract_info.cancellation) {
                return <Money amount={row_obj.contract_info.cancellation.ask_price} currency={currency} />;
            }
            return '-';
        },

    buy_price:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            if (row_obj.contract_info) {
                const { ask_price: cancellation_price = 0 } = row_obj.contract_info.cancellation || {};
                return <Money amount={row_obj.contract_info.buy_price - cancellation_price} currency={currency} />;
            }
            return '';
        },
    multiplier: ({ row_obj }: TCellContentProps) => {
        return row_obj?.contract_info?.multiplier ? `x${row_obj.contract_info.multiplier}` : '';
    },
};

export const AccumulatorOpenPositionsCell = {
    type: ({ row_obj, is_footer }: TCellContentProps) => {
        if (is_footer) return localize('Total');

        return (
            <MarketSymbolIconRow
                key={row_obj.id}
                payload={row_obj.contract_info}
                should_show_multiplier={false}
                should_show_accumulator={false}
            />
        );
    },
    growth_rate: ({ row_obj }) =>
        row_obj?.contract_info?.growth_rate ? `${getGrowthRatePercentage(row_obj.contract_info.growth_rate)}%` : '',
    currency: ({ row_obj }: TCellContentProps) => (
        <CurrencyWrapper currency={getCurrencyDisplayCode(row_obj.contract_info?.currency)} />
    ),
    stake:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            if (row_obj.contract_info) {
                return <Money amount={row_obj.contract_info.buy_price} currency={currency} />;
            }
            return '';
        },
    limit_order:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            const { take_profit } = row_obj.contract_info?.limit_order || {};
            return (
                <div>
                    {take_profit?.order_amount ? (
                        <Money has_sign amount={take_profit.order_amount} currency={currency} />
                    ) : (
                        '-'
                    )}
                </div>
            );
        },
    bid_price:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            if (!row_obj?.contract_info?.bid_price) return '-';

            const total_profit = getTotalProfit(row_obj.contract_info);
            return (
                <div
                    className={classNames('open-positions__bid_price', {
                        'open-positions__bid_price--negative': total_profit < 0,
                        'open-positions__bid_price--positive': total_profit > 0,
                    })}
                >
                    <Money amount={row_obj.contract_info.bid_price} currency={currency} />
                </div>
            );
        },
    profit:
        ({ currency }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj }: TCellContentProps) => {
            if (!row_obj?.contract_info?.profit) return null;
            const total_profit = getTotalProfit(row_obj.contract_info);
            // eslint-disable-next-line consistent-return
            return (
                <div
                    className={classNames('open-positions__profit-loss', {
                        'open-positions__profit-loss--negative': total_profit < 0,
                        'open-positions__profit-loss--positive': total_profit > 0,
                    })}
                >
                    <Money amount={Math.abs(total_profit)} currency={currency} />
                    <div className='open-positions__profit-loss--movement'>
                        {total_profit > 0 ? <Icon icon='IcProfit' /> : <Icon icon='IcLoss' />}
                    </div>
                </div>
            );
        },
    action:
        ({ getPositionById, onClickSell }: TMultiplierOpenPositionstemplateProps) =>
        ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return <div className='open-positions__row-action' />;
            }

            const { contract_info } = row_obj;
            const position = getPositionById(contract_info.contract_id);
            const { is_sell_requested } = position || {};

            return (
                <div className='open-positions__row-action'>
                    <ContractCardSell
                        contract_info={contract_info}
                        is_sell_requested={is_sell_requested}
                        getCardLabels={getCardLabels}
                        onClickSell={onClickSell}
                    />
                </div>
            );
        },
};
/* eslint-enable react/display-name, react/prop-types */
