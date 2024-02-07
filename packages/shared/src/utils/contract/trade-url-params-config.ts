import { ActiveSymbols } from '@deriv/api-types';
import { TTextValueStrings, TTradeTypesCategories } from '../constants/contract';

type TGetTradeURLParamsArgs = {
    active_symbols?: ActiveSymbols;
    contract_types_list?: TTradeTypesCategories;
};

type TTradeParams = {
    contract_type?: string;
    chart_type?: string;
    granularity?: number;
    symbol?: string;
};

type TTradeParamsResult = {
    contractType?: string;
    chartType?: string;
    granularity?: number;
    showModal?: boolean;
    symbol?: string;
};

type TTradeURLParamsConfig = {
    [key: string]: TTextValueStrings[];
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
    const searchParams = new URLSearchParams(window.location.search);
    chart_type && searchParams.set(TRADE_URL_PARAMS.CHART_TYPE, getParamTextByValue(chart_type, 'chartType'));
    !isNaN(Number(granularity)) &&
        searchParams.set(
            TRADE_URL_PARAMS.INTERVAL,
            getParamTextByValue(Number(granularity), TRADE_URL_PARAMS.INTERVAL)
        );
    symbol && searchParams.set(TRADE_URL_PARAMS.SYMBOL, symbol);
    contract_type && searchParams.set(TRADE_URL_PARAMS.TRADE_TYPE, contract_type);
    const newRelativePathQuery = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
};

export const getTradeURLParams = ({ active_symbols = [], contract_types_list = {} }: TGetTradeURLParamsArgs = {}) => {
    const searchParams = new URLSearchParams(window.location.search);
    const result: TTradeParamsResult = {};
    if (searchParams) {
        const { chart_type, interval, trade_type, symbol } = Object.values(TRADE_URL_PARAMS).reduce<{
            [key: string]: string | null;
        }>((acc, key) => (searchParams.get(key) ? { ...acc, [key]: searchParams.get(key) } : acc), {});
        const validInterval = tradeURLParamsConfig.interval.find(item => item.text === interval);
        const validChartType = tradeURLParamsConfig.chartType.find(item => item.text === chart_type);
        const isSymbolValid = active_symbols.some(item => item.symbol === symbol);
        const contractList = Object.keys(contract_types_list).reduce<string[]>((acc, key) => {
            const categories: TTradeTypesCategories['Ups & Downs']['categories'] =
                contract_types_list[key]?.categories || [];
            return [...acc, ...categories.map(contract => (contract as TTextValueStrings).value)];
        }, []);
        const isTradeTypeValid = contractList.includes(trade_type ?? '');

        if (validInterval) {
            result.granularity = Number(validInterval.value);
        }
        if (validChartType) {
            result.chartType = validChartType.value;
        }
        if (isSymbolValid) {
            result.symbol = symbol || '';
        }
        if (isTradeTypeValid) {
            result.contractType = trade_type || '';
        } else if (trade_type) {
            result.showModal = true;
        }
    }
    return result;
};
