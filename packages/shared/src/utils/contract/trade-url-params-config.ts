type TTradeURLParamsConfig = {
    [key: string]: {
        text: string;
        value: string;
    }[];
};

type TSetTradeURLParamsArgs = {
    contract_type?: string;
    symbol?: string;
    chart_type?: string;
    granularity?: number;
};

const TRADE_URL_PARAMS = {
    CHART_TYPE: 'chart_type',
    INTERVAL: 'interval',
    SYMBOL: 'symbol',
    TRADE_TYPE: 'trade_type',
};

const tradeURLParamsConfig: TTradeURLParamsConfig = {
    chartType: [
        { text: 'area', value: 'line' },
        { text: 'candle', value: 'candles' },
        { text: 'hollow', value: 'hollow' },
        { text: 'ohlc', value: 'ohlc' },
    ],
    chartInterval: [
        { text: '1t', value: '0' },
        { text: '1m', value: '60' },
        { text: '2m', value: '120' },
        { text: '3m', value: '180' },
        { text: '5m', value: '300' },
        { text: '10m', value: '600' },
        { text: '15m', value: '900' },
        { text: '30m', value: '1800' },
        { text: '1h', value: '3600' },
        { text: '2h', value: '7200' },
        { text: '4h', value: '14400' },
        { text: '8h', value: '28800' },
        { text: '1d', value: '86400' },
    ],
};

const getParamTextByValue = (value: number | string, key: string) =>
    tradeURLParamsConfig[key].find(interval => interval.value === value.toString())?.text ?? '';

export const setTradeURLParams = ({ contract_type, symbol, chart_type, granularity }: TSetTradeURLParamsArgs) => {
    if ('URLSearchParams' in window) {
        const searchParams = new URLSearchParams(window.location.search);
        chart_type && searchParams.set('chart_type', getParamTextByValue(chart_type, 'chartType'));
        granularity && searchParams.set('interval', getParamTextByValue(granularity, 'chartInterval'));
        symbol && searchParams.set('symbol', symbol);
        contract_type && searchParams.set('trade_type', contract_type);
        const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState(null, '', newRelativePathQuery);
    }
};

export const getTradeURLParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return Object.keys(TRADE_URL_PARAMS).reduce(
        (acc, key) => (searchParams.get(key) ? { ...acc, [key]: searchParams.get(key) } : acc),
        {}
    );
};
