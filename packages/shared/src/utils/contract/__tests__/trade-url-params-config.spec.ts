import { ActiveSymbols } from '@deriv/api-types';
import { getTradeURLParams, setTradeURLParams } from '../trade-url-params-config';
import { TRADE_TYPES } from '../contract';
import { routes } from '../../routes';

const areaChartType = { text: 'area', value: 'line' };
const oneTickInterval = '1t';
const symbol = 'R_100';

describe('getTradeURLParams', () => {
    const accumulatorsTitle = 'Accumulators';
    const activeSymbols = [
        {
            allow_forward_starting: 1,
            display_name: 'Volatility 100 Index',
            display_order: 2,
            exchange_is_open: 1,
            is_trading_suspended: 0,
            market: 'synthetic_index',
            market_display_name: 'Derived',
            pip: 0.01,
            subgroup: 'synthetics',
            subgroup_display_name: 'Synthetics',
            submarket: 'random_index',
            submarket_display_name: 'Continuous Indices',
            symbol,
            symbol_type: 'stockindex',
        } as ActiveSymbols[0],
    ];
    const contractTypesList = {
        [accumulatorsTitle]: {
            name: accumulatorsTitle,
            categories: [{ value: TRADE_TYPES.ACCUMULATOR, text: accumulatorsTitle }],
        },
    };
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: {
                hostname: 'https://localhost:8443/',
                pathname: routes.trade,
            },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            enumerable: true,
            value: originalWindowLocation,
        });
        location.search = '';
    });

    it('should return an object with chartType & interval based on the URL query params when called without arguments', () => {
        location.search = `?symbol=${symbol}&trade_type=${TRADE_TYPES.ACCUMULATOR}&chart_type=${areaChartType.text}&interval=${oneTickInterval}`;
        expect(getTradeURLParams()).toMatchObject({
            chartType: areaChartType.value,
            granularity: 0,
        });
    });
    it('should return an object without granularity if interval in the URL is incorrect', () => {
        location.search = `?symbol=${symbol}&trade_type=${TRADE_TYPES.ACCUMULATOR}&chart_type=${areaChartType.text}&interval=BLA`;
        expect(getTradeURLParams()).toMatchObject({
            chartType: areaChartType.value,
        });
    });
    it('should return an object without chartType if chart_type in the URL is incorrect', () => {
        location.search = `?symbol=${symbol}&trade_type=${TRADE_TYPES.ACCUMULATOR}&chart_type=BLA&interval=${oneTickInterval}`;
        expect(getTradeURLParams()).toMatchObject({
            granularity: 0,
        });
    });
    it('should return an object with "area" chartType if interval is 1t even if chart_type in the URL is valid but not area', () => {
        location.search = `?symbol=${symbol}&trade_type=${TRADE_TYPES.ACCUMULATOR}&chart_type=hollow&interval=${oneTickInterval}`;
        expect(getTradeURLParams()).toMatchObject({
            chartType: areaChartType.value,
            granularity: 0,
        });
    });
    it('should return an object with symbol based on the URL query param when active_symbols is passed', () => {
        location.search = `?symbol=${symbol}`;
        expect(getTradeURLParams({ active_symbols: activeSymbols })).toMatchObject({
            symbol,
        });
    });
    it('should return an object with showModal & without symbol if symbol in the URL is incorrect and when called with active_symbols', () => {
        location.search = `?symbol=BLA&chart_type=${areaChartType.text}&interval=${oneTickInterval}`;
        expect(getTradeURLParams({ active_symbols: activeSymbols })).toMatchObject({
            chartType: areaChartType.value,
            granularity: 0,
            showModal: true,
        });
    });
    it('should return an object with contractType based on the URL query param when contract_types_list is passed', () => {
        location.search = `?trade_type=${TRADE_TYPES.ACCUMULATOR}`;
        expect(getTradeURLParams({ contract_types_list: contractTypesList })).toMatchObject({
            contractType: TRADE_TYPES.ACCUMULATOR,
        });
    });
    it('should return an object with showModal & without contractType if trade_type in the URL is incorrect', () => {
        location.search = `?trade_type=BLA&chart_type=${areaChartType.text}&interval=${oneTickInterval}`;
        expect(getTradeURLParams({ contract_types_list: contractTypesList })).toMatchObject({
            chartType: areaChartType.value,
            granularity: 0,
            showModal: true,
        });
    });
    it('should return an empty object if there are no URL query params regardless of the passed arguments', () => {
        expect(
            getTradeURLParams({
                active_symbols: activeSymbols,
                contract_types_list: contractTypesList,
            })
        ).toMatchObject({});

        expect(getTradeURLParams()).toMatchObject({});
    });
});

describe('setTradeURLParams', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set interval query param into URL based on the received granularity value', () => {
        const spyHistoryReplaceState = jest.spyOn(window.history, 'replaceState');
        setTradeURLParams({
            granularity: 0,
        });
        expect(spyHistoryReplaceState).toBeCalledWith(
            {},
            document.title,
            `${routes.trade}?interval=${oneTickInterval}`
        );
    });
    it('should set chart_type query param into URL based on the received chart_type value', () => {
        const spyHistoryReplaceState = jest.spyOn(window.history, 'replaceState');
        setTradeURLParams({
            chartType: areaChartType.value,
        });
        expect(spyHistoryReplaceState).toBeCalledWith(
            {},
            document.title,
            `${routes.trade}?chart_type=${areaChartType.text}`
        );
    });
    it('should set symbol query param into URL based on the received symbol value', () => {
        const spyHistoryReplaceState = jest.spyOn(window.history, 'replaceState');
        setTradeURLParams({
            symbol,
        });
        expect(spyHistoryReplaceState).toBeCalledWith({}, document.title, `${routes.trade}?symbol=${symbol}`);
    });
    it('should set trade_type query param into URL based on the received contract_type value', () => {
        const spyHistoryReplaceState = jest.spyOn(window.history, 'replaceState');
        setTradeURLParams({
            contractType: TRADE_TYPES.ACCUMULATOR,
        });
        expect(spyHistoryReplaceState).toBeCalledWith(
            {},
            document.title,
            `${routes.trade}?trade_type=${TRADE_TYPES.ACCUMULATOR}`
        );
    });
    it('should not set any query params into URL when called with empty object', () => {
        const spyHistoryReplaceState = jest.spyOn(window.history, 'replaceState');
        setTradeURLParams({});
        expect(spyHistoryReplaceState).not.toBeCalled();
    });
    it('should not set any query params into URL when location.pathname is not routes.trade', () => {
        location.pathname = routes.positions;
        const spyHistoryReplaceState = jest.spyOn(window.history, 'replaceState');
        setTradeURLParams({
            contractType: TRADE_TYPES.ACCUMULATOR,
        });
        expect(spyHistoryReplaceState).not.toBeCalled();
    });
});
