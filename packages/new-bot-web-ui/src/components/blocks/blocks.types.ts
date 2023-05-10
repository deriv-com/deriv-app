export type TMarketOption = {
    group: string;
    text: string;
    value: string;
};

export type TDropdowns = TMarketDropdown;

export type TSelectedValuesSelect = TMarket | TTradeType | TDurationOptions | TMarketOption;

type TIconTradeType = Array<'CALLE' | 'PUTE'>;

export type TTradeType = {
    group: string;
    icon: TIconTradeType;
    text: string;
    value: string;
};

export type TDurationOptions = {
    max: number;
    min: number;
    text: string;
    value: string;
};

export type TMarket = {
    index: number;
    label: string;
};

export type TMarketDropdown = Array<TMarket>;

export type TQSCache = {
    selected_market?: TMarket;
    selected_symbol?: TMarketOption;
    input_stake?: string;
    input_loss?: string;
    input_martingale_size?: string;
    input_profit?: string;
    input_oscar_unit?: string;
    input_alembert_unit?: string;
    selected_trade_type?: TTradeType;
    selected_duration_unit?: TDurationOptions;
    input_duration_value?: number | string;
};
