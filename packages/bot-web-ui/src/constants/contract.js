import { localize } from '@deriv/translations';

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
    PAYOUT: localize('Sell Price:'),
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
    NOT_AVAILABLE: localize('N/A'),
});

export const getSupportedContracts = is_high_low => ({
    ASIANU: {
        name: localize('Asian Up'),
        position: 'top',
    },
    ASIAND: {
        name: localize('Asian Down'),
        position: 'bottom',
    },
    CALL: {
        name: is_high_low ? localize('Higher') : localize('Rise'),
        position: 'top',
    },
    PUT: {
        name: is_high_low ? localize('Lower') : localize('Fall'),
        position: 'bottom',
    },
    CALLE: {
        name: localize('Rise'),
        position: 'top',
    },
    PUTE: {
        name: localize('Fall'),
        position: 'bottom',
    },
    CALLSPREAD: {
        name: localize('Spread Up'),
        position: 'top',
    },
    PUTSPREAD: {
        name: localize('Spread Down'),
        position: 'bottom',
    },
    DIGITMATCH: {
        name: localize('Matches'),
        position: 'top',
    },
    DIGITDIFF: {
        name: localize('Differs'),
        position: 'bottom',
    },
    DIGITEVEN: {
        name: localize('Even'),
        position: 'top',
    },
    DIGITODD: {
        name: localize('Odd'),
        position: 'bottom',
    },
    DIGITOVER: {
        name: localize('Over'),
        position: 'top',
    },
    DIGITUNDER: {
        name: localize('Under'),
        position: 'bottom',
    },
    EXPIRYMISS: {
        name: localize('Ends Outside'),
        position: 'top',
    },
    EXPIRYRANGE: {
        name: localize('Ends Between'),
        position: 'bottom',
    },
    LBFLOATCALL: {
        name: localize('Close-to-Low'),
        position: 'top',
    },
    LBFLOATPUT: {
        name: localize('High-to-Close'),
        position: 'top',
    },
    LBHIGHLOW: {
        name: localize('High-to-Low'),
        position: 'top',
    },
    MULTUP: {
        name: localize('Up'),
        position: 'top',
    },
    MULTDOWN: {
        name: localize('Down'),
        position: 'bottom',
    },
    ONETOUCH: {
        name: localize('Touch'),
        position: 'top',
    },
    NOTOUCH: {
        name: localize('No Touch'),
        position: 'bottom',
    },
    RANGE: {
        name: localize('Stays Between'),
        position: 'top',
    },
    UPORDOWN: {
        name: localize('Goes Outside'),
        position: 'bottom',
    },
    RESETCALL: {
        name: localize('Reset Call'),
        position: 'top',
    },
    RESETPUT: {
        name: localize('Reset Put'),
        position: 'bottom',
    },
    RUNHIGH: {
        name: localize('Only Ups'),
        position: 'top',
    },
    RUNLOW: {
        name: localize('Only Downs'),
        position: 'bottom',
    },
    TICKHIGH: {
        name: localize('High Tick'),
        position: 'top',
    },
    TICKLOW: {
        name: localize('Low Tick'),
        position: 'bottom',
    },
});

export const getContractConfig = is_high_low => ({
    ...getSupportedContracts(is_high_low),
});

export const getContractTypeDisplay = (type, is_high_low = false) =>
    getContractConfig(is_high_low)[type] ? getContractConfig(is_high_low)[type.toUpperCase()].name : '';
