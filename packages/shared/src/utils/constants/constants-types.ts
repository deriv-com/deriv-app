export type TCONTRACT_SHADES = {
    CALL: string;
    PUT: string;
    CALLE: string;
    PUTE: string;
    EXPIRYRANGE: string;
    EXPIRYMISS: string;
    RANGE: string;
    UPORDOWN: string;
    ONETOUCH: string;
    NOTOUCH: string;
    ASIANU: string;
    ASIAND: string;
    MULTUP: string;
    MULTDOWN: string;
};

export type TDEFAULT_SHADES = {
    1: string;
    2: string;
};

export type TBARRIER_COLORS = {
    GREEN: string;
    RED: string;
    ORANGE: string;
    GRAY: string;
    DARK_GRAY: string;
};

export type TBARRIER_LINE_STYLES = {
    DASHED: string;
    DOTTED: string;
    SOLID: string;
};

export type TGetLocalizedBasis = {
    payout: string;
    stake: string;
    multiplier: string;
};

type TContractTypesConfig = {
    title: string;
    trade_types: string[];
    basis: string[];
    components: string[];
    barrier_count?: number;
    config?: { hide_duration: boolean };
};

export type TGetContractTypesConfig = (symbol: string) => {
    rise_fall: TContractTypesConfig;
    rise_fall_equal: TContractTypesConfig;
    high_low: TContractTypesConfig;
    touch: TContractTypesConfig;
    end: TContractTypesConfig;
    stay: TContractTypesConfig;
    asian: TContractTypesConfig;
    match_diff: TContractTypesConfig;
    even_odd: TContractTypesConfig;
    over_under: TContractTypesConfig;
    lb_call: TContractTypesConfig;
    lb_put: TContractTypesConfig;
    lb_high_low: TContractTypesConfig;
    tick_high_low: TContractTypesConfig;
    run_high_low: TContractTypesConfig;
    reset: TContractTypesConfig;
    callputspread: TContractTypesConfig;
    multiplier: TContractTypesConfig;
};

export type TGetCardLabels = {
    APPLY: string;
    STAKE: string;
    CLOSE: string;
    CANCEL: string;
    CURRENT_STAKE: string;
    DEAL_CANCEL_FEE: string;
    TAKE_PROFIT: string;
    BUY_PRICE: string;
    STOP_LOSS: string;
    TOTAL_PROFIT_LOSS: string;
    PROFIT_LOSS: string;
    POTENTIAL_PROFIT_LOSS: string;
    INDICATIVE_PRICE: string;
    PAYOUT: string;
    PURCHASE_PRICE: string;
    POTENTIAL_PAYOUT: string;
    TICK: string;
    WON: string;
    LOST: string;
    DAYS: string;
    DAY: string;
    SELL: string;
    INCREMENT_VALUE: string;
    DECREMENT_VALUE: string;
    TAKE_PROFIT_LOSS_NOT_AVAILABLE: string;
    DONT_SHOW_THIS_AGAIN: string;
    RESALE_NOT_OFFERED: string;
    NOT_AVAILABLE: string;
};

type TSupportedContracts = {
    name: JSX.Element;
    position: string;
};

export type TGetUnsupportedContracts = {
    EXPIRYMISS: TSupportedContracts;
    EXPIRYRANGE: TSupportedContracts;
    RANGE: TSupportedContracts;
    UPORDOWN: TSupportedContracts;
    RESETCALL: TSupportedContracts;
    RESETPUT: TSupportedContracts;
    TICKHIGH: TSupportedContracts;
    TICKLOW: TSupportedContracts;
    ASIANU: TSupportedContracts;
    ASIAND: TSupportedContracts;
    LBFLOATCALL: TSupportedContracts;
    LBFLOATPUT: TSupportedContracts;
    LBHIGHLOW: TSupportedContracts;
    CALLSPREAD: TSupportedContracts;
    PUTSPREAD: TSupportedContracts;
    RUNHIGH: TSupportedContracts;
    RUNLOW: TSupportedContracts;
};
