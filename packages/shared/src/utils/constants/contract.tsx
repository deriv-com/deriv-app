import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { shouldShowCancellation, shouldShowExpiration } from '../contract';

export const getLocalizedBasis = () => ({
    payout: localize('Payout'),
    stake: localize('Stake'),
    multiplier: localize('Multiplier'),
});

/**
 * components can be undef or an array containing any of: 'start_date', 'barrier', 'last_digit'
 *     ['duration', 'amount'] are omitted, as they're available in all contract types
 */
type TContractTypesConfig = {
    title: string;
    trade_types: string[];
    basis: string[];
    components: string[];
    barrier_count?: number;
    config?: { hide_duration?: boolean; should_override?: boolean };
};

type TGetContractTypesConfig = (symbol: string) => Record<string, TContractTypesConfig>;

export const getContractTypesConfig: TGetContractTypesConfig = symbol => ({
    rise_fall: {
        title: localize('Rise/Fall'),
        trade_types: ['CALL', 'PUT'],
        basis: ['stake', 'payout'],
        components: ['start_date'],
        barrier_count: 0,
    },
    rise_fall_equal: {
        title: localize('Rise/Fall'),
        trade_types: ['CALLE', 'PUTE'],
        basis: ['stake', 'payout'],
        components: ['start_date'],
        barrier_count: 0,
    },
    high_low: {
        title: localize('Higher/Lower'),
        trade_types: ['CALL', 'PUT'],
        basis: ['stake', 'payout'],
        components: ['barrier'],
        barrier_count: 1,
    },
    touch: {
        title: localize('Touch/No Touch'),
        trade_types: ['ONETOUCH', 'NOTOUCH'],
        basis: ['stake', 'payout'],
        components: ['barrier'],
    },
    end: {
        title: localize('Ends In/Ends Out'),
        trade_types: ['EXPIRYMISS', 'EXPIRYRANGE'],
        basis: ['stake', 'payout'],
        components: ['barrier'],
    },
    stay: {
        title: localize('Stays In/Goes Out'),
        trade_types: ['RANGE', 'UPORDOWN'],
        basis: ['stake', 'payout'],
        components: ['barrier'],
    },
    asian: {
        title: localize('Asian Up/Asian Down'),
        trade_types: ['ASIANU', 'ASIAND'],
        basis: ['stake', 'payout'],
        components: [],
    },
    match_diff: {
        title: localize('Matches/Differs'),
        trade_types: ['DIGITMATCH', 'DIGITDIFF'],
        basis: ['stake', 'payout'],
        components: ['last_digit'],
    },
    even_odd: {
        title: localize('Even/Odd'),
        trade_types: ['DIGITODD', 'DIGITEVEN'],
        basis: ['stake', 'payout'],
        components: [],
    },
    over_under: {
        title: localize('Over/Under'),
        trade_types: ['DIGITOVER', 'DIGITUNDER'],
        basis: ['stake', 'payout'],
        components: ['last_digit'],
    },
    // TODO: update the rest of these contracts config
    lb_call: { title: localize('Close-to-Low'), trade_types: ['LBFLOATCALL'], basis: ['multiplier'], components: [] },
    lb_put: { title: localize('High-to-Close'), trade_types: ['LBFLOATPUT'], basis: ['multiplier'], components: [] },
    lb_high_low: { title: localize('High-to-Low'), trade_types: ['LBHIGHLOW'], basis: ['multiplier'], components: [] },
    tick_high_low: {
        title: localize('High Tick/Low Tick'),
        trade_types: ['TICKHIGH', 'TICKLOW'],
        basis: [],
        components: [],
    },
    run_high_low: {
        title: localize('Only Ups/Only Downs'),
        trade_types: ['RUNHIGH', 'RUNLOW'],
        basis: [],
        components: [],
    },
    reset: {
        title: localize('Reset Up/Reset Down'),
        trade_types: ['RESETCALL', 'RESETPUT'],
        basis: [],
        components: [],
    },
    callputspread: {
        title: localize('Spread Up/Spread Down'),
        trade_types: ['CALLSPREAD', 'PUTSPREAD'],
        basis: [],
        components: [],
    },
    multiplier: {
        title: localize('Multipliers'),
        trade_types: ['MULTUP', 'MULTDOWN'],
        basis: ['stake'],
        components: [
            'take_profit',
            'stop_loss',
            ...(shouldShowCancellation(symbol) ? ['cancellation'] : []),
            ...(shouldShowExpiration(symbol) ? ['expiration'] : []),
        ],
        config: { hide_duration: true },
    }, // hide Duration for Multiplier contracts for now
    vanilla: {
        title: localize('Call/Put'),
        trade_types: ['VANILLALONGCALL', 'VANILLALONGPUT'],
        basis: ['stake'],
        components: ['duration', 'strike', 'amount', 'vanilla_trade_type'],
        barrier_count: 1,
        config: { should_override: true },
    },
});

// Config for rendering trade options
export const getContractCategoriesConfig = () => ({
    Multipliers: { name: localize('Multipliers'), categories: ['multiplier'] },
    'Ups & Downs': {
        name: localize('Ups & Downs'),
        categories: ['rise_fall', 'rise_fall_equal', 'run_high_low', 'reset', 'asian', 'callputspread'],
    },
    'Highs & Lows': { name: localize('Highs & Lows'), categories: ['high_low', 'touch', 'tick_high_low'] },
    'Ins & Outs': { name: localize('Ins & Outs'), categories: ['end', 'stay'] },
    'Look Backs': { name: localize('Look Backs'), categories: ['lb_high_low', 'lb_put', 'lb_call'] },
    Digits: { name: localize('Digits'), categories: ['match_diff', 'even_odd', 'over_under'] },
    Vanillas: { name: localize('Vanillas'), categories: ['vanilla'] },
});

export const unsupported_contract_types_list = [
    // TODO: remove these once all contract types are supported
    'callputspread',
    'run_high_low',
    'reset',
    'asian',
    'tick_high_low',
    'end',
    'stay',
    'lb_call',
    'lb_put',
    'lb_high_low',
];

export const getCardLabels = () => ({
    APPLY: localize('Apply'),
    BUY_PRICE: localize('Buy price:'),
    CANCEL: localize('Cancel'),
    CLOSE: localize('Close'),
    CONTRACT_VALUE: localize('Contract value:'),
    CURRENT_STAKE: localize('Current stake:'),
    DAY: localize('day'),
    DAYS: localize('days'),
    DEAL_CANCEL_FEE: localize('Deal cancel. fee:'),
    DECREMENT_VALUE: localize('Decrement value'),
    DONT_SHOW_THIS_AGAIN: localize("Don't show this again"),
    ENTRY_SPOT: localize('Entry spot:'),
    INCREMENT_VALUE: localize('Increment value'),
    INDICATIVE_PRICE: localize('Indicative price:'),
    LOST: localize('Lost'),
    NOT_AVAILABLE: localize('N/A'),
    PAYOUT: localize('Sell price:'),
    POTENTIAL_PAYOUT: localize('Payout limit:'),
    POTENTIAL_PROFIT_LOSS: localize('Potential profit/loss:'),
    PROFIT_LOSS: localize('Profit/Loss:'),
    PURCHASE_PRICE: localize('Buy price:'),
    RESALE_NOT_OFFERED: localize('Resale not offered'),
    SELL: localize('Sell'),
    STAKE: localize('Stake:'),
    STOP_LOSS: localize('Stop loss:'),
    STRIKE: localize('Strike:'),
    TAKE_PROFIT_LOSS_NOT_AVAILABLE: localize(
        'Take profit and/or stop loss are not available while deal cancellation is active.'
    ),
    TAKE_PROFIT: localize('Take profit:'),
    TICK: localize('Tick '),
    TOTAL_PROFIT_LOSS: localize('Total profit/loss:'),
    WON: localize('Won'),
});

export const getMarketNamesMap = () => ({
    FRXAUDCAD: localize('AUD/CAD'),
    FRXAUDCHF: localize('AUD/CHF'),
    FRXAUDJPY: localize('AUD/JPY'),
    FRXAUDNZD: localize('AUD/NZD'),
    FRXAUDPLN: localize('AUD/PLN'),
    FRXAUDUSD: localize('AUD/USD'),
    FRXBROUSD: localize('Oil/USD'),
    FRXEURAUD: localize('EUR/AUD'),
    FRXEURCAD: localize('EUR/CAD'),
    FRXEURCHF: localize('EUR/CHF'),
    FRXEURGBP: localize('EUR/GBP'),
    FRXEURJPY: localize('EUR/JPY'),
    FRXEURNZD: localize('EUR/NZD'),
    FRXEURUSD: localize('EUR/USD'),
    FRXGBPAUD: localize('GBP/AUD'),
    FRXGBPCAD: localize('GBP/CAD'),
    FRXGBPCHF: localize('GBP/CHF'),
    FRXGBPJPY: localize('GBP/JPY'),
    FRXGBPNOK: localize('GBP/NOK'),
    FRXGBPUSD: localize('GBP/USD'),
    FRXNZDJPY: localize('NZD/JPY'),
    FRXNZDUSD: localize('NZD/USD'),
    FRXUSDCAD: localize('USD/CAD'),
    FRXUSDCHF: localize('USD/CHF'),
    FRXUSDJPY: localize('USD/JPY'),
    FRXUSDNOK: localize('USD/NOK'),
    FRXUSDPLN: localize('USD/PLN'),
    FRXUSDSEK: localize('USD/SEK'),
    FRXXAGUSD: localize('Silver/USD'),
    FRXXAUUSD: localize('Gold/USD'),
    FRXXPDUSD: localize('Palladium/USD'),
    FRXXPTUSD: localize('Platinum/USD'),
    OTC_AEX: localize('Dutch Index'),
    OTC_AS51: localize('Australian Index'),
    OTC_DJI: localize('Wall Street Index'),
    OTC_FCHI: localize('French Index'),
    OTC_FTSE: localize('UK Index'),
    OTC_GDAXI: localize('German Index'),
    OTC_HSI: localize('Hong Kong Index'),
    OTC_IBEX35: localize('Spanish Index'),
    OTC_N225: localize('Japanese Index'),
    OTC_NDX: localize('US Tech Index'),
    OTC_SPC: localize('US Index'),
    OTC_SSMI: localize('Swiss Index'),
    OTC_SX5E: localize('Euro 50 Index'),
    R_10: localize('Volatility 10 Index'),
    R_25: localize('Volatility 25 Index'),
    R_50: localize('Volatility 50 Index'),
    R_75: localize('Volatility 75 Index'),
    R_100: localize('Volatility 100 Index'),
    BOOM300N: localize('Boom 300 Index'),
    BOOM500: localize('Boom 500 Index'),
    BOOM1000: localize('Boom 1000 Index'),
    CRASH300N: localize('Crash 300 Index'),
    CRASH500: localize('Crash 500 Index'),
    CRASH1000: localize('Crash 1000 Index'),
    RDBEAR: localize('Bear Market Index'),
    RDBULL: localize('Bull Market Index'),
    STPRNG: localize('Step Index'),
    WLDAUD: localize('AUD Basket'),
    WLDEUR: localize('EUR Basket'),
    WLDGBP: localize('GBP Basket'),
    WLDXAU: localize('Gold Basket'),
    WLDUSD: localize('USD Basket'),
    '1HZ10V': localize('Volatility 10 (1s) Index'),
    '1HZ100V': localize('Volatility 100 (1s) Index'),
    '1HZ150V': localize('Volatility 150 (1s) Index'),
    '1HZ200V': localize('Volatility 200 (1s) Index'),
    '1HZ250V': localize('Volatility 250 (1s) Index'),
    '1HZ300V': localize('Volatility 300 (1s) Index'),
    JD10: localize('Jump 10 Index'),
    JD25: localize('Jump 25 Index'),
    JD50: localize('Jump 50 Index'),
    JD75: localize('Jump 75 Index'),
    JD100: localize('Jump 100 Index'),
    JD150: localize('Jump 150 Index'),
    JD200: localize('Jump 200 Index'),
    CRYBCHUSD: localize('BCH/USD'),
    CRYBNBUSD: localize('BNB/USD'),
    CRYBTCLTC: localize('BTC/LTC'),
    CRYIOTUSD: localize('IOT/USD'),
    CRYNEOUSD: localize('NEO/USD'),
    CRYOMGUSD: localize('OMG/USD'),
    CRYTRXUSD: localize('TRX/USD'),
    CRYBTCETH: localize('BTC/ETH'),
    CRYZECUSD: localize('ZEC/USD'),
    CRYXMRUSD: localize('ZMR/USD'),
    CRYXMLUSD: localize('XLM/USD'),
    CRYXRPUSD: localize('XRP/USD'),
    CRYBTCUSD: localize('BTC/USD'),
    CRYDSHUSD: localize('DSH/USD'),
    CRYETHUSD: localize('ETH/USD'),
    CRYEOSUSD: localize('EOS/USD'),
    CRYLTCUSD: localize('LTC/USD'),
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

type TGetSupportedContracts = keyof ReturnType<typeof getSupportedContracts>;
export const getSupportedContracts = (is_high_low?: boolean) => ({
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
    VANILLALONGCALL: {
        name: <Localize i18n_default_text='Call' />,
        position: 'top',
    },
    VANILLALONGPUT: {
        name: <Localize i18n_default_text='Put' />,
        position: 'bottom',
    },
});

export const getContractConfig = (is_high_low?: boolean) => ({
    ...getSupportedContracts(is_high_low),
    ...getUnsupportedContracts(),
});

/*
// TODO we can combine getContractTypeDisplay and getContractTypePosition functions.
the difference between these two functions is just the property they return. (name/position)
*/
export const getContractTypeDisplay = (type: TGetSupportedContracts, is_high_low = false) =>
    getContractConfig(is_high_low)[type].name;

export const getContractTypePosition = (type: TGetSupportedContracts, is_high_low = false) =>
    getContractConfig(is_high_low)[type].position || 'top';

export const isCallPut = (trade_type: 'rise_fall' | 'rise_fall_equal' | 'high_low'): boolean =>
    trade_type === 'rise_fall' || trade_type === 'rise_fall_equal' || trade_type === 'high_low';
