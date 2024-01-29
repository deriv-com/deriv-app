import { ActiveSymbols } from '@deriv/api-types';

type TTradeURLParamsConfig = {
    [key: string]: {
        text: string;
        value: string;
    }[];
};

export type TTextValueStrings = {
    text: string;
    value: string;
};

type TContractTypesList = {
    [key: string]: {
        name: string;
        categories: Array<string | TTextValueStrings>;
    };
};

type TGetTradeURLParamsArgs = {
    active_symbols?: ActiveSymbols;
    contract_types_list?: TContractTypesList;
};

type TTradeParams = {
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
    interval: [
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

export const setTradeURLParams = ({ contract_type, symbol, chart_type, granularity }: TTradeParams) => {
    if ('URLSearchParams' in window) {
        const searchParams = new URLSearchParams(window.location.search);
        chart_type && searchParams.set('chart_type', getParamTextByValue(chart_type, 'chartType'));
        !isNaN(Number(granularity)) &&
            searchParams.set('interval', getParamTextByValue(Number(granularity), 'interval'));
        symbol && searchParams.set('symbol', symbol);
        contract_type && searchParams.set('trade_type', contract_type);
        const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState(null, '', newRelativePathQuery);
    }
};

export const getTradeURLParams = ({ active_symbols, contract_types_list }: TGetTradeURLParamsArgs) => {
    const searchParams = new URLSearchParams(window.location.search);
    const result: TTradeParams & { showModal?: boolean } = {};
    if (searchParams) {
        const { chart_type, interval, trade_type, symbol } = Object.values(TRADE_URL_PARAMS).reduce<{
            [key: string]: string | null;
        }>((acc, key) => (searchParams.get(key) ? { ...acc, [key]: searchParams.get(key) } : acc), {});
        const configInterval = tradeURLParamsConfig.interval.find(item => item.text === interval);
        const configChartType = tradeURLParamsConfig.chartType.find(item => item.text === chart_type);
        const hasSymbol = active_symbols?.some(item => item.symbol === symbol);
        const contract_list = Object.keys(contract_types_list || {}).reduce<string[]>((acc, key) => {
            const categories: TContractTypesList['Ups & Downs']['categories'] =
                contract_types_list?.[key]?.categories || [];
            return [...acc, ...categories.map(contract => (contract as TTextValueStrings).value)];
        }, []);
        const hasTradeType = contract_list.includes(trade_type ?? '');
        if (configInterval) {
            result.granularity = Number(configInterval?.value);
        }
        if (configChartType) {
            result.chart_type = configChartType?.value;
        }
        if (hasSymbol) {
            result.symbol = symbol || '';
        }
        if (hasTradeType) {
            result.contract_type = trade_type || '';
        } else if (trade_type) {
            result.showModal = true;
        }
    }
    return result;
};
