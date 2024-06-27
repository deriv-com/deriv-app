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

export const availableContracts = [
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
export const GLOSSARY = {
    GROWTH_RATE: 'Growth rate',
    PAYOUT: 'Payout',
    PREVIOUS_SPOT_PRICE: 'Previous spot price',
    RANGE: 'Range',
    SLIPPAGE_RISK: 'Slippage risk',
    TAKE_PROFIT: 'Take profit',
};
