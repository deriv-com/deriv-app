import classNames from 'classnames';
import React from 'react';
import { ArrowIndicator, Label, Money, ContractCard, ContractCardSell, Popover } from '@deriv/components';
import { getCurrencyDisplayCode, getTotalProfit, getGrowthRatePercentage, getCardLabels } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import ProgressSliderStream from '../Containers/progress-slider-stream';
import { TCellContentProps, THeaderProps } from 'Types';
import { getProfitOrLoss } from '../Helpers/profit-loss';
import IndicativeCell from '../Components/indicative-cell';
import MarketSymbolIconRow from '../Components/market-symbol-icon-row';
import ProfitLossCell from '../Components/profit-loss-cell';
import CurrencyWrapper from '../Components/currency-wrapper';
import { useStore } from '@deriv/stores';
import moment from 'moment';

type TPortfolioStore = ReturnType<typeof useStore>['portfolio'];

const map = {
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

export type TKeys = string;

const getModeFromValue = (key: string) => map[key as keyof typeof map] || map.default;

type TAccumulatorOpenPositionstemplateProps = Omit<
    TMultiplierOpenPositionstemplateProps,
    'onClickCancel' | 'server_time'
> & {
    isDesktop: boolean;
};

type TMultiplierOpenPositionstemplateProps = Pick<
    TPortfolioStore,
    'getPositionById' | 'onClickCancel' | 'onClickSell'
> & {
    currency: string;
    server_time: moment.Moment;
    isDesktop: boolean;
};

/* eslint-disable react/display-name, react/prop-types */
export const getStatementTableColumnsTemplate = (currency: string, isDesktop: boolean) => [
    {
        key: 'icon',
        title: isDesktop ? localize('Type') : '',
        col_index: 'icon',
        renderCellContent: ({ passthrough, row_obj }: TCellContentProps) => {
            const icon = passthrough.isTopUp(row_obj) ? 'icCashierTopUp' : null;
            return <MarketSymbolIconRow icon={icon} key={row_obj.transaction_id} payload={row_obj} />;
        },
    },
    {
        title: localize('Ref. ID'),
        col_index: 'refid',
        renderCellContent: ({ cell_value, row_obj }: TCellContentProps) => {
            return (
                <Popover
                    alignment={'top'}
                    message={localize('Transaction performed by (App ID: {{app_id}})', { app_id: row_obj.app_id })}
                >
                    {cell_value}
                </Popover>
            );
        },
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: () => <CurrencyWrapper currency={getCurrencyDisplayCode(currency)} />,
    },
    {
        title: localize('Transaction time'),
        col_index: 'date',
        renderCellContent: ({ cell_value }: TCellContentProps) => {
            return <span>{cell_value} GMT</span>;
        },
    },
    {
        key: 'mode',
        title: localize('Transaction'),
        col_index: 'action_type',
        renderCellContent: ({ cell_value, passthrough, row_obj }: TCellContentProps) => (
            <Label mode={getModeFromValue(cell_value)}>
                {(passthrough.isTopUp(row_obj) && localize('Top up')) || row_obj.action}
            </Label>
        ),
    },
    {
        title: localize('Credit/Debit'),
        col_index: 'amount',
        renderCellContent: ({ cell_value }: TCellContentProps) => (
            <div className={`amount--${getProfitOrLoss(cell_value)}`}>
                <Money has_sign amount={cell_value.replace(/[,]+/g, '')} currency={currency} />
            </div>
        ),
    },
    {
        title: localize('Balance'),
        col_index: 'balance',
        renderCellContent: ({ cell_value }: TCellContentProps) => (
            <Money amount={cell_value.replace(/[,]+/g, '')} currency={currency} />
        ),
    },
];
export const getProfitTableColumnsTemplate = (currency: string, items_count: number, isDesktop: boolean) => [
    {
        key: 'icon',
        title: isDesktop ? localize('Type') : '',
        col_index: 'action_type',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return localize('Profit/loss on the last {{item_count}} contracts', { item_count: items_count });
            }
            return <MarketSymbolIconRow key={row_obj.transaction_id} payload={row_obj} />;
        },
    },
    {
        title: localize('Ref. ID'),
        col_index: 'transaction_id',
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: ({ is_footer }: TCellContentProps) =>
            is_footer ? '' : <CurrencyWrapper currency={getCurrencyDisplayCode(currency)} />,
    },
    {
        title: localize('Buy time'),
        col_index: 'purchase_time',
        renderCellContent: ({ cell_value, is_footer }: TCellContentProps) => {
            if (is_footer) return '';
            return <span>{cell_value} GMT</span>;
        },
    },
    {
        title: localize('Stake'),
        col_index: 'buy_price',
        renderCellContent: ({ cell_value, is_footer }: TCellContentProps) => {
            if (is_footer) return '';

            return <Money amount={cell_value} currency={currency} />;
        },
    },
    {
        title: localize('Sell time'),
        col_index: 'sell_time',
        renderHeader: ({ title }: THeaderProps) => <span>{title}</span>,
        renderCellContent: ({ cell_value, is_footer }: TCellContentProps) => {
            if (is_footer) return '';
            return <span>{cell_value} GMT</span>;
        },
    },
    {
        title: localize('Contract value'),
        col_index: 'sell_price',
        renderCellContent: ({ cell_value, is_footer }: TCellContentProps) => {
            if (is_footer) return '';

            return <Money amount={cell_value} currency={currency} />;
        },
    },
    {
        title: localize('Total profit/loss'),
        col_index: 'profit_loss',
        renderCellContent: ({ cell_value }: TCellContentProps) => (
            <ProfitLossCell value={cell_value}>
                <Money has_sign amount={cell_value.replace(/[,]+/g, '')} currency={currency} />
            </ProfitLossCell>
        ),
    },
];
export const getOpenPositionsColumnsTemplate = (currency: string, isDesktop: boolean) => [
    {
        key: 'icon',
        title: isDesktop ? localize('Type') : '',
        col_index: 'type',
        renderCellContent: ({ row_obj, is_footer, is_vanilla, is_turbos }: TCellContentProps) => {
            if (is_footer) return localize('Total');

            return (
                <MarketSymbolIconRow
                    key={row_obj.id}
                    payload={row_obj.contract_info}
                    has_full_contract_title={is_vanilla || is_turbos}
                />
            );
        },
    },
    {
        title: localize('Ref. ID'),
        col_index: 'reference',
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: ({ row_obj }: TCellContentProps) => (
            <CurrencyWrapper currency={getCurrencyDisplayCode(row_obj.contract_info?.currency)} />
        ),
    },
    {
        title: localize('Stake'),
        col_index: 'purchase',
        renderCellContent: ({ cell_value }: TCellContentProps) => <Money amount={cell_value} currency={currency} />,
    },
    {
        title: localize('Potential payout'),
        col_index: 'payout',
        renderHeader: ({ title, is_vanilla }: THeaderProps) => <span>{is_vanilla ? localize('Strike') : title}</span>,
        renderCellContent: ({ cell_value, row_obj, is_vanilla }: TCellContentProps) => {
            const non_vanilla_payout = cell_value ? <Money amount={cell_value} currency={currency} /> : <span>-</span>;
            return is_vanilla ? row_obj.barrier?.toFixed(2) : non_vanilla_payout;
        },
    },
    {
        title: localize('Total profit/loss'),
        col_index: 'profit',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            const { profit_loss, contract_info } = row_obj ?? {};
            if (!profit_loss && profit_loss !== 0 && !contract_info?.profit && contract_info?.profit !== 0) return;
            const profit = profit_loss ?? contract_info.profit;
            // eslint-disable-next-line consistent-return
            return (
                <div
                    className={classNames('open-positions__profit-loss', {
                        'open-positions__profit-loss--negative': profit < 0,
                        'open-positions__profit-loss--positive': profit > 0,
                    })}
                >
                    <Money amount={Math.abs(profit)} currency={currency} />
                    <ArrowIndicator className='open-positions__profit-loss--movement' value={profit} />
                </div>
            );
        },
    },
    {
        title: localize('Contract value'),
        col_index: 'indicative',
        renderCellContent: ({ cell_value, row_obj, is_footer }: TCellContentProps) => {
            const { profit_loss, contract_info } = row_obj ?? {};
            const profit = profit_loss ?? contract_info.profit;

            return (
                <IndicativeCell
                    amount={+cell_value}
                    currency={currency}
                    contract_info={row_obj.contract_info}
                    is_sell_requested={row_obj.is_sell_requested}
                    is_footer={is_footer}
                    profit={profit}
                />
            );
        },
    },
    {
        title: localize('Remaining time'),
        col_index: 'id',
        renderCellContent: ({ row_obj }: TCellContentProps) => (
            <ProgressSliderStream contract_info={row_obj.contract_info} />
        ),
    },
];

export const getMultiplierOpenPositionsColumnsTemplate = ({
    currency,
    onClickCancel,
    onClickSell,
    getPositionById,
    server_time,
    isDesktop,
}: TMultiplierOpenPositionstemplateProps) => [
    {
        title: isDesktop ? localize('Type') : '',
        col_index: 'type',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) return localize('Total');

            return (
                <MarketSymbolIconRow key={row_obj.id} payload={row_obj.contract_info} should_show_multiplier={false} />
            );
        },
    },
    {
        title: localize('Multiplier'),
        col_index: 'multiplier',
        renderCellContent: ({ row_obj }: TCellContentProps) =>
            row_obj.contract_info && row_obj.contract_info.multiplier ? `x${row_obj.contract_info.multiplier}` : '',
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: ({ row_obj }: TCellContentProps) => (
            <CurrencyWrapper currency={getCurrencyDisplayCode(row_obj.contract_info?.currency)} />
        ),
    },
    {
        title: localize('Contract cost'),
        col_index: 'buy_price',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            if (row_obj.contract_info) {
                const { ask_price: cancellation_price = 0 } = row_obj.contract_info.cancellation || {};
                return <Money amount={row_obj.contract_info.buy_price - cancellation_price} currency={currency} />;
            }
            return '';
        },
    },
    {
        title: localize('Deal cancel. fee'),
        col_index: 'cancellation',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            if (!row_obj.contract_info || !row_obj.contract_info.underlying) return '-';
            if (row_obj.contract_info.cancellation) {
                return <Money amount={row_obj.contract_info.cancellation.ask_price} currency={currency} />;
            }
            return '-';
        },
    },
    {
        title: <Localize i18n_default_text='Stake' />,
        col_index: 'purchase',
        renderCellContent: ({ cell_value }: TCellContentProps) => <Money amount={cell_value} currency={currency} />,
    },
    {
        title: <Localize i18n_default_text='Take profit<0 />Stop loss' components={[<br key={0} />]} />,
        col_index: 'limit_order',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return '';
            }

            const { take_profit, stop_loss } = row_obj.contract_info?.limit_order || {};
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
    },
    {
        title: localize('Contract value'),
        col_index: 'bid_price',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
            if (is_footer) {
                return '';
            }

            if (!row_obj.contract_info || !row_obj.contract_info.bid_price) return '-';

            const total_profit = getTotalProfit(row_obj.contract_info);
            return (
                <div
                    className={classNames('open-positions__bid_price', {
                        'open-positions__bid_price--negative': total_profit < 0,
                        'open-positions__bid_price--positive': total_profit > 0,
                    })}
                >
                    <Money amount={row_obj.contract_info.bid_price} currency={currency} />
                    <ArrowIndicator className='open-positions__bid_price--movement' value={total_profit} />
                </div>
            );
        },
    },
    {
        title: isDesktop ? (
            <Localize i18n_default_text='Total<0 />profit/loss' components={[<br key={0} />]} />
        ) : (
            <Localize i18n_default_text='Total profit/loss' />
        ),
        col_index: 'profit',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            if (!row_obj.contract_info || !row_obj.contract_info.profit) return null;
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
                    <ArrowIndicator className='open-positions__profit-loss--movement' value={total_profit} />
                </div>
            );
        },
    },
    {
        title: localize('Action'),
        col_index: 'action',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
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
        },
    },
];

export const getAccumulatorOpenPositionsColumnsTemplate = ({
    currency,
    onClickSell,
    getPositionById,
    isDesktop,
}: TAccumulatorOpenPositionstemplateProps) => [
    {
        title: isDesktop ? localize('Type') : '',
        col_index: 'type',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
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
    },
    {
        title: localize('Growth rate'),
        col_index: 'growth_rate',
        renderCellContent: ({ row_obj }: TCellContentProps) =>
            row_obj.contract_info && row_obj.contract_info.growth_rate
                ? `${getGrowthRatePercentage(row_obj.contract_info.growth_rate)}%`
                : '',
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: ({ row_obj }: TCellContentProps) => (
            <CurrencyWrapper currency={getCurrencyDisplayCode(row_obj.contract_info?.currency)} />
        ),
    },
    {
        title: localize('Stake'),
        col_index: isDesktop ? 'buy_price' : 'purchase',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            if (row_obj.contract_info) {
                return <Money amount={row_obj.contract_info.buy_price} currency={currency} />;
            }
            return '';
        },
    },
    {
        title: localize('Take profit'),
        col_index: 'limit_order',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
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
    },
    {
        title: localize('Contract value'),
        col_index: 'bid_price',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            if (!row_obj.contract_info || !row_obj.contract_info.bid_price) return '-';

            const total_profit = getTotalProfit(row_obj.contract_info);
            return (
                <div
                    className={classNames('open-positions__bid_price', {
                        'open-positions__bid_price--negative': total_profit < 0,
                        'open-positions__bid_price--positive': total_profit > 0,
                    })}
                >
                    <Money amount={row_obj.contract_info.bid_price} currency={currency} />
                    <ArrowIndicator className='open-positions__bid_price--movement' value={total_profit} />
                </div>
            );
        },
    },
    {
        title: localize('Total profit/loss'),
        col_index: 'profit',
        renderCellContent: ({ row_obj }: TCellContentProps) => {
            if (!row_obj.contract_info || !row_obj.contract_info.profit) return null;
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
                    <ArrowIndicator className='open-positions__profit-loss--movement' value={total_profit} />
                </div>
            );
        },
    },
    {
        title: localize('Action'),
        col_index: 'action',
        renderCellContent: ({ row_obj, is_footer }: TCellContentProps) => {
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
    },
];
