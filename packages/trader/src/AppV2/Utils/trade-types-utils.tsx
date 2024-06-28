import React from 'react';
import { Localize } from '@deriv/translations';

export const CONTRACT_LIST = {
    ACCUMULATORS: 'Accumulators',
    VANILLAS: 'Vanillas',
    TURBOS: 'Turbos',
    MULTIPLIERS: 'Multipliers',
    'RISE/FALL': 'Rise/Fall',
    'HIGHER/LOWER': 'Higher/Lower',
    'TOUCH/NO TOUCH': 'Touch/No touch',
    'MATCHES/DIFFERS': 'Matches/Differs',
    'EVEN/ODD': 'Even/Odd',
    'OVER/UNDER': 'Over/Under',
};

export const AVAILABLE_CONTRACTS = [
    { tradeType: <Localize i18n_default_text='Accumulators' />, id: CONTRACT_LIST.ACCUMULATORS },
    { tradeType: <Localize i18n_default_text='Vanillas' />, id: CONTRACT_LIST.VANILLAS },
    { tradeType: <Localize i18n_default_text='Turbos' />, id: CONTRACT_LIST.TURBOS },
    { tradeType: <Localize i18n_default_text='Multipliers' />, id: CONTRACT_LIST.MULTIPLIERS },
    { tradeType: <Localize i18n_default_text='Rise/Fall' />, id: CONTRACT_LIST['RISE/FALL'] },
    { tradeType: <Localize i18n_default_text='Higher/Lower' />, id: CONTRACT_LIST['HIGHER/LOWER'] },
    { tradeType: <Localize i18n_default_text='Touch/No touch' />, id: CONTRACT_LIST['TOUCH/NO TOUCH'] },
    { tradeType: <Localize i18n_default_text='Matches/Differs' />, id: CONTRACT_LIST['MATCHES/DIFFERS'] },
    { tradeType: <Localize i18n_default_text='Even/Odd' />, id: CONTRACT_LIST['EVEN/ODD'] },
    { tradeType: <Localize i18n_default_text='Over/Under' />, id: CONTRACT_LIST['OVER/UNDER'] },
];

// TODO: add Localize?
export const TERM = {
    GROWTH_RATE: 'Growth rate',
    PAYOUT: 'Payout',
    PREVIOUS_SPOT_PRICE: 'Previous spot price',
    RANGE: 'Range',
    SLIPPAGE_RISK: 'Slippage risk',
    TAKE_PROFIT: 'Take profit',
};

export const DEFINITION = {
    [TERM.GROWTH_RATE]: (
        <Localize i18n_default_text='You can choose a growth rate with values of 1%, 2%, 3%, 4%, and 5%.' />
    ),
    [TERM.PAYOUT]: <Localize i18n_default_text='Payout is the sum of your initial stake and profit.' />,
    [TERM.PREVIOUS_SPOT_PRICE]: <Localize i18n_default_text='Spot price on the previous tick.' />,
    [TERM.RANGE]: (
        <Localize i18n_default_text='It is a percentage of the previous spot price. The percentage rate is based on your choice of the index and the growth rate.' />
    ),
    [TERM.SLIPPAGE_RISK]: (
        <Localize i18n_default_text='The spot price may change by the time your order reaches our servers. When this happens, your payout may be affected.' />
    ),
    [TERM.TAKE_PROFIT]: (
        <Localize i18n_default_text='If you select this feature, your trade will be closed automatically at the nearest available asset price when your profit reaches or exceeds the take profit amount. Your profit may be more than the amount you entered depending on the market price at closing.' />
    ),
};
