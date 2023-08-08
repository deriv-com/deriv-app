import React from 'react';
import { isMobile } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { THeaderProps } from 'Types';
import {
    AccumulatorOpenPositionsCell,
    MultiplierOpenPositionsCell,
    OpenPositionsCell,
    ProfitTableCell,
    map,
    getModeFromValue,
    StatementTableCells,
    TMultiplierOpenPositionstemplateProps,
} from './data-table-cells';

export const getStatementTableColumnsTemplate = (currency: string) => [
    {
        key: 'icon',
        title: isMobile() ? '' : localize('Type'),
        col_index: 'icon',
        renderCellContent: StatementTableCells.icon,
    },
    {
        title: localize('Ref. ID'),
        col_index: 'refid',
        renderCellContent: StatementTableCells.refid,
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: StatementTableCells.currency(currency),
    },
    {
        title: localize('Transaction time'),
        col_index: 'date',
        renderCellContent: StatementTableCells.date,
    },
    {
        key: 'mode',
        title: localize('Transaction'),
        col_index: 'action_type',
        renderCellContent: StatementTableCells.action_type,
    },
    {
        title: localize('Credit/Debit'),
        col_index: 'amount',
        renderCellContent: StatementTableCells.amount(currency),
    },
    {
        title: localize('Balance'),
        col_index: 'balance',
        renderCellContent: StatementTableCells.balance(currency),
    },
];

export const getProfitTableColumnsTemplate = (currency: string, items_count: number) => [
    {
        key: 'icon',
        title: isMobile() ? '' : localize('Type'),
        col_index: 'action_type',
        renderCellContent: ProfitTableCell.action_type(items_count),
    },
    {
        title: localize('Ref. ID'),
        col_index: 'transaction_id',
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: ProfitTableCell.currency(currency),
    },
    {
        title: localize('Buy time'),
        col_index: 'purchase_time',
        renderCellContent: ProfitTableCell.purchase_time,
    },
    {
        title: localize('Buy price'),
        col_index: 'buy_price',
        renderCellContent: ProfitTableCell.buy_price(currency),
    },
    {
        title: localize('Sell time'),
        col_index: 'sell_time',
        renderHeader: ({ title }: THeaderProps) => <span>{title}</span>,
        renderCellContent: ProfitTableCell.sell_time,
    },
    {
        title: localize('Sell price'),
        col_index: 'sell_price',
        renderCellContent: ProfitTableCell.sell_price(currency),
    },
    {
        title: localize('Profit / Loss'),
        col_index: 'profit_loss',
        renderCellContent: ProfitTableCell.profit_loss(currency),
    },
];
export const getOpenPositionsColumnsTemplate = (currency: string) => [
    {
        key: 'icon',
        title: isMobile() ? '' : localize('Type'),
        col_index: 'type',
        renderCellContent: OpenPositionsCell.type,
    },
    {
        title: localize('Ref. ID'),
        col_index: 'reference',
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: OpenPositionsCell.currency,
    },
    {
        title: localize('Buy price'),
        col_index: 'purchase',
        renderCellContent: OpenPositionsCell.purchase(currency),
    },
    {
        title: localize('Payout limit'),
        col_index: 'payout',
        renderHeader: ({ title, is_vanilla }: THeaderProps) => <span>{is_vanilla ? localize('Strike') : title}</span>,
        renderCellContent: OpenPositionsCell.payout(currency),
    },
    {
        title: localize('Indicative profit/loss'),
        col_index: 'profit',
        renderCellContent: OpenPositionsCell.profit(currency),
    },
    {
        title: localize('Indicative price'),
        col_index: 'indicative',
        renderCellContent: OpenPositionsCell.indicative(currency),
    },
    {
        title: localize('Remaining time'),
        col_index: 'id',
        renderCellContent: OpenPositionsCell.id,
    },
];
export const getMultiplierOpenPositionsColumnsTemplate = (props: TMultiplierOpenPositionstemplateProps) => [
    {
        title: isMobile() ? '' : localize('Type'),
        col_index: 'type',
        renderCellContent: MultiplierOpenPositionsCell.type,
    },
    {
        title: localize('Multiplier'),
        col_index: 'multiplier',
        renderCellContent: MultiplierOpenPositionsCell.multiplier,
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: MultiplierOpenPositionsCell.currency,
    },
    {
        title: localize('Stake'),
        col_index: 'buy_price',
        renderCellContent: MultiplierOpenPositionsCell.buy_price(props),
    },
    {
        title: localize('Deal cancel. fee'),
        col_index: 'cancellation',
        renderCellContent: MultiplierOpenPositionsCell.cancellation(props),
    },
    {
        title: isMobile() ? (
            <Localize i18n_default_text='Total buy price' />
        ) : (
            <Localize i18n_default_text='Buy price' />
        ),
        col_index: 'purchase',
        renderCellContent: MultiplierOpenPositionsCell.purchase(props),
    },
    {
        title: <Localize i18n_default_text='Take profit<0 />Stop loss' components={[<br key={0} />]} />,
        col_index: 'limit_order',
        renderCellContent: MultiplierOpenPositionsCell.limit_order(props),
    },
    {
        title: localize('Current stake'),
        col_index: 'bid_price',
        renderCellContent: MultiplierOpenPositionsCell.bid_price(props),
    },
    {
        title: isMobile() ? (
            <Localize i18n_default_text='Total profit/loss' />
        ) : (
            <Localize i18n_default_text='Total<0 />profit/loss' components={[<br key={0} />]} />
        ),
        col_index: 'profit',
        renderCellContent: MultiplierOpenPositionsCell.profit(props),
    },
    {
        title: localize('Action'),
        col_index: 'action',
        renderCellContent: MultiplierOpenPositionsCell.action(props),
    },
];

export const getAccumulatorOpenPositionsColumnsTemplate = (props: TMultiplierOpenPositionstemplateProps) => [
    {
        title: isMobile() ? '' : localize('Type'),
        col_index: 'type',
        renderCellContent: AccumulatorOpenPositionsCell.type,
    },
    {
        title: localize('Growth rate'),
        col_index: 'growth_rate',
        renderCellContent: AccumulatorOpenPositionsCell.growth_rate,
    },
    {
        title: localize('Currency'),
        col_index: 'currency',
        renderCellContent: AccumulatorOpenPositionsCell.currency,
    },
    {
        title: isMobile() ? localize('Total stake') : localize('Initial stake'),
        col_index: isMobile() ? 'purchase' : 'buy_price',
        renderCellContent: AccumulatorOpenPositionsCell.stake(props),
    },
    {
        title: localize('Take profit'),
        col_index: 'limit_order',
        renderCellContent: AccumulatorOpenPositionsCell.limit_order(props),
    },
    {
        title: localize('Current stake'),
        col_index: 'bid_price',
        renderCellContent: AccumulatorOpenPositionsCell.bid_price(props),
    },
    {
        title: localize('Total profit/loss'),
        col_index: 'profit',
        renderCellContent: AccumulatorOpenPositionsCell.profit(props),
    },
    {
        title: localize('Action'),
        col_index: 'action',
        renderCellContent: AccumulatorOpenPositionsCell.action(props),
    },
];
/* eslint-enable react/display-name, react/prop-types */
