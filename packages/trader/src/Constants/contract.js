import React from 'react';
import { localize, Localize } from '@deriv/translations';

export const getCardLabels = () => ({
    APPLY: localize('Apply'),
    STAKE: localize('Stake:'),
    CLOSE: localize('Close'),
    CANCEL: localize('Cancel'),
    CURRENT_STAKE: localize('Current stake:'),
    DEAL_CANCEL_FEE: localize('Deal cancel. fee:'),
    TAKE_PROFIT: localize('Take profit:'),
    BUY_PRICE: localize('Buy price:'),
    STOP_LOSS: localize('Stop loss:'),
    TOTAL_PROFIT_LOSS: localize('Total profit/loss:'),
    PROFIT_LOSS: localize('Profit/Loss:'),
    POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss:'),
    INDICATIVE_PRICE: localize('Indicative price:'),
    PAYOUT: localize('Sell price:'),
    PURCHASE_PRICE: localize('Buy price:'),
    POTENTIAL_PAYOUT: localize('Payout limit:'),
    TICK: localize('Tick '),
    WON: localize('Won'),
    LOST: localize('Lost'),
    DAYS: localize('Days'),
    DAY: localize('Day'),
    SELL: localize('Sell'),
    INCREMENT_VALUE: localize('Increment value'),
    DECREMENT_VALUE: localize('Decrement value'),
    TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
        'Take profit and/or stop loss are not available while deal cancellation is active.'
    ),
    DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
    RESALE_NOT_OFFERED: localize('Resale not offered'),
});

export const getMarketNamesMap = () => ({
    FRXAUDCAD: <Localize i18n_default_text='AUD/CAD' />,
    FRXAUDCHF: <Localize i18n_default_text='AUD/CHF' />,
    FRXAUDJPY: <Localize i18n_default_text='AUD/JPY' />,
    FRXAUDNZD: <Localize i18n_default_text='AUD/NZD' />,
    FRXAUDPLN: <Localize i18n_default_text='AUD/PLN' />,
    FRXAUDUSD: <Localize i18n_default_text='AUD/USD' />,
    FRXBROUSD: <Localize i18n_default_text='Oil/USD' />,
    FRXEURAUD: <Localize i18n_default_text='EUR/AUD' />,
    FRXEURCAD: <Localize i18n_default_text='EUR/CAD' />,
    FRXEURCHF: <Localize i18n_default_text='EUR/CHF' />,
    FRXEURGBP: <Localize i18n_default_text='EUR/GBP' />,
    FRXEURJPY: <Localize i18n_default_text='EUR/JPY' />,
    FRXEURNZD: <Localize i18n_default_text='EUR/NZD' />,
    FRXEURUSD: <Localize i18n_default_text='EUR/USD' />,
    FRXGBPAUD: <Localize i18n_default_text='GBP/AUD' />,
    FRXGBPCAD: <Localize i18n_default_text='GBP/CAD' />,
    FRXGBPCHF: <Localize i18n_default_text='GBP/CHF' />,
    FRXGBPJPY: <Localize i18n_default_text='GBP/JPY' />,
    FRXGBPNOK: <Localize i18n_default_text='GBP/NOK' />,
    FRXGBPUSD: <Localize i18n_default_text='GBP/USD' />,
    FRXNZDJPY: <Localize i18n_default_text='NZD/JPY' />,
    FRXNZDUSD: <Localize i18n_default_text='NZD/USD' />,
    FRXUSDCAD: <Localize i18n_default_text='USD/CAD' />,
    FRXUSDCHF: <Localize i18n_default_text='USD/CHF' />,
    FRXUSDJPY: <Localize i18n_default_text='USD/JPY' />,
    FRXUSDNOK: <Localize i18n_default_text='USD/NOK' />,
    FRXUSDPLN: <Localize i18n_default_text='USD/PLN' />,
    FRXUSDSEK: <Localize i18n_default_text='USD/SEK' />,
    FRXXAGUSD: <Localize i18n_default_text='Silver/USD' />,
    FRXXAUUSD: <Localize i18n_default_text='Gold/USD' />,
    FRXXPDUSD: <Localize i18n_default_text='Palladium/USD' />,
    FRXXPTUSD: <Localize i18n_default_text='Platinum/USD' />,
    OTC_AEX: <Localize i18n_default_text='Dutch Index' />,
    OTC_AS51: <Localize i18n_default_text='Australian Index' />,
    OTC_DJI: <Localize i18n_default_text='Wall Street Index' />,
    OTC_FCHI: <Localize i18n_default_text='French Index' />,
    OTC_FTSE: <Localize i18n_default_text='UK Index' />,
    OTC_GDAXI: <Localize i18n_default_text='German Index' />,
    OTC_HSI: <Localize i18n_default_text='Hong Kong Index' />,
    OTC_IBEX35: <Localize i18n_default_text='Spanish Index' />,
    OTC_N225: <Localize i18n_default_text='Japanese Index' />,
    OTC_NDX: <Localize i18n_default_text='US Tech Index' />,
    OTC_SPC: <Localize i18n_default_text='US Index' />,
    OTC_SSMI: <Localize i18n_default_text='Swiss Index' />,
    OTC_SX5E: <Localize i18n_default_text='Euro 50 Index' />,
    R_10: <Localize i18n_default_text='Volatility 10 Index' />,
    R_25: <Localize i18n_default_text='Volatility 25 Index' />,
    R_50: <Localize i18n_default_text='Volatility 50 Index' />,
    R_75: <Localize i18n_default_text='Volatility 75 Index' />,
    R_100: <Localize i18n_default_text='Volatility 100 Index' />,
    RDBEAR: <Localize i18n_default_text='Bear Market Index' />,
    RDBULL: <Localize i18n_default_text='Bull Market Index' />,
    WLDAUD: <Localize i18n_default_text='AUD Index' />,
    WLDEUR: <Localize i18n_default_text='EUR Index' />,
    WLDGBP: <Localize i18n_default_text='GBP Index' />,
    WLDUSD: <Localize i18n_default_text='USD Index' />,
    '1HZ10V': <Localize i18n_default_text='Volatility 10 (1s) Index' />,
    '1HZ100V': <Localize i18n_default_text='Volatility 100 (1s) Index' />,
});

export const getUnsupportedContracts = () => ({
    EXPIRYMISS: {
        name: <Localize i18n_default_text='Ends Outside' />,
        position: 'top',
    },
    EXPIRYRANGE: {
        name: <Localize i18n_default_text='Ends Between' />,
        position: 'bottom',
    },
    RANGE: {
        name: <Localize i18n_default_text='Stays Between' />,
        position: 'top',
    },
    UPORDOWN: {
        name: <Localize i18n_default_text='Goes Outside' />,
        position: 'bottom',
    },
    RESETCALL: {
        name: <Localize i18n_default_text='Reset Call' />,
        position: 'top',
    },
    RESETPUT: {
        name: <Localize i18n_default_text='Reset Put' />,
        position: 'bottom',
    },
    TICKHIGH: {
        name: <Localize i18n_default_text='High Tick' />,
        position: 'top',
    },
    TICKLOW: {
        name: <Localize i18n_default_text='Low Tick' />,
        position: 'bottom',
    },
    ASIANU: {
        name: <Localize i18n_default_text='Asian Up' />,
        position: 'top',
    },
    ASIAND: {
        name: <Localize i18n_default_text='Asian Down' />,
        position: 'bottom',
    },
    LBFLOATCALL: {
        name: <Localize i18n_default_text='Close-to-Low' />,
        position: 'top',
    },
    LBFLOATPUT: {
        name: <Localize i18n_default_text='High-to-Close' />,
        position: 'top',
    },
    LBHIGHLOW: {
        name: <Localize i18n_default_text='High-to-Low' />,
        position: 'top',
    },
    CALLSPREAD: {
        name: <Localize i18n_default_text='Spread Up' />,
        position: 'top',
    },
    PUTSPREAD: {
        name: <Localize i18n_default_text='Spread Down' />,
        position: 'bottom',
    },
    RUNHIGH: {
        name: <Localize i18n_default_text='Only Ups' />,
        position: 'top',
    },
    RUNLOW: {
        name: <Localize i18n_default_text='Only Downs' />,
        position: 'bottom',
    },
});

export const getSupportedContracts = is_high_low => ({
    CALL: {
        name: is_high_low ? <Localize i18n_default_text='Higher' /> : <Localize i18n_default_text='Rise' />,
        position: 'top',
    },
    PUT: {
        name: is_high_low ? <Localize i18n_default_text='Lower' /> : <Localize i18n_default_text='Fall' />,
        position: 'bottom',
    },
    CALLE: {
        name: <Localize i18n_default_text='Rise' />,
        position: 'top',
    },
    PUTE: {
        name: <Localize i18n_default_text='Fall' />,
        position: 'bottom',
    },
    DIGITMATCH: {
        name: <Localize i18n_default_text='Matches' />,
        position: 'top',
    },
    DIGITDIFF: {
        name: <Localize i18n_default_text='Differs' />,
        position: 'bottom',
    },
    DIGITEVEN: {
        name: <Localize i18n_default_text='Even' />,
        position: 'top',
    },
    DIGITODD: {
        name: <Localize i18n_default_text='Odd' />,
        position: 'bottom',
    },
    DIGITOVER: {
        name: <Localize i18n_default_text='Over' />,
        position: 'top',
    },
    DIGITUNDER: {
        name: <Localize i18n_default_text='Under' />,
        position: 'bottom',
    },
    ONETOUCH: {
        name: <Localize i18n_default_text='Touch' />,
        position: 'top',
    },
    NOTOUCH: {
        name: <Localize i18n_default_text='No Touch' />,
        position: 'bottom',
    },
    MULTUP: {
        name: <Localize i18n_default_text='Up' />,
        position: 'top',
    },
    MULTDOWN: {
        name: <Localize i18n_default_text='Down' />,
        position: 'bottom',
    },
});

export const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

export const getContractTypeDisplay = (type, is_high_low = false) => {
    return getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].name : '';
};

export const getContractTypePosition = (type, is_high_low = false) =>
    getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].position : 'top';
