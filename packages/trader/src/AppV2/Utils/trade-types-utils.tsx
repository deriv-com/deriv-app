import React from 'react';
import { Localize } from '@deriv/translations';

export const CONTRACT_LIST = {
    ACCUMULATORS: 'Accumulators',
    VANILLAS: 'Vanillas',
    TURBOS: 'Turbos',
    MULTIPLIERS: 'Multipliers',
    RISE_FALL: 'Rise/Fall',
    HIGHER_LOWER: 'Higher/Lower',
    TOUCH_NO_TOUCH: 'Touch/No Touch',
    MATCHES_DIFFERS: 'Matches/Differs',
    EVEN_ODD: 'Even/Odd',
    OVER_UNDER: 'Over/Under',
};

export const AVAILABLE_CONTRACTS = [
    { tradeType: <Localize i18n_default_text='Accumulators' />, id: CONTRACT_LIST.ACCUMULATORS },
    { tradeType: <Localize i18n_default_text='Vanillas' />, id: CONTRACT_LIST.VANILLAS },
    { tradeType: <Localize i18n_default_text='Turbos' />, id: CONTRACT_LIST.TURBOS },
    { tradeType: <Localize i18n_default_text='Multipliers' />, id: CONTRACT_LIST.MULTIPLIERS },
    { tradeType: <Localize i18n_default_text='Rise/Fall' />, id: CONTRACT_LIST.RISE_FALL },
    { tradeType: <Localize i18n_default_text='Higher/Lower' />, id: CONTRACT_LIST.HIGHER_LOWER },
    { tradeType: <Localize i18n_default_text='Touch/No Touch' />, id: CONTRACT_LIST.TOUCH_NO_TOUCH },
    { tradeType: <Localize i18n_default_text='Matches/Differs' />, id: CONTRACT_LIST.MATCHES_DIFFERS },
    { tradeType: <Localize i18n_default_text='Even/Odd' />, id: CONTRACT_LIST.EVEN_ODD },
    { tradeType: <Localize i18n_default_text='Over/Under' />, id: CONTRACT_LIST.OVER_UNDER },
];
