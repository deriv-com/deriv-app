import PortfolioStore from '../portfolio-store.js';
import { configure } from 'mobx';

configure({ safeDescriptors: false });

let mockedPortfolioStore: PortfolioStore;

const symbol = '1HZ100V';
const contracts = [
    {
        app_id: 24075,
        buy_price: 10,
        contract_id: 229749680508,
        contract_type: 'MULTUP',
        currency: 'USD',
        date_start: 1705570990,
        expiry_time: 4859222399,
        longcode:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 100, minus commissions.",
        payout: 0,
        purchase_time: 1705570990,
        shortcode: 'MULTUP_1HZ100V_10.00_10_1705570990_4859222399_0_0.00',
        symbol,
        transaction_id: 458367398868,
    },
    {
        app_id: 16929,
        buy_price: 10,
        contract_id: 230152813328,
        contract_type: 'MULTDOWN',
        currency: 'USD',
        date_start: 1705921444,
        expiry_time: 4859567999,
        longcode:
            "If you select 'Down', your total profit/loss will be the percentage decrease in AUD/JPY, multiplied by 300, minus commissions.",
        payout: 0,
        purchase_time: 1705921444,
        shortcode: 'MULTDOWN_FRXAUDJPY_10.00_30_1705921444_4859567999_0_0.00',
        symbol,
        transaction_id: 459167693628,
    },
];

beforeEach(() => {
    mockedPortfolioStore = new PortfolioStore({
        active_symbols: {
            active_symbols: [
                {
                    allow_forward_starting: 1,
                    display_name: 'Volatility 100 (1s) Index',
                    display_order: 3,
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
                },
            ],
        },
    });
    mockedPortfolioStore.portfolioHandler({
        echo_req: {
            portfolio: 1,
            req_id: 8,
        },
        msg_type: 'portfolio',
        portfolio: {
            contracts,
        },
        req_id: 8,
    });
});

describe('PortfolioStore', () => {
    it('getPositionById() should return a position by its id, or undefined when id is incorrect or not provided', () => {
        expect(mockedPortfolioStore.getPositionById(230152813328)).toMatchObject({
            contract_info: contracts[1],
            contract_update: undefined,
            details: contracts[1].longcode,
            display_name: '',
            id: contracts[1].contract_id,
            indicative: 0,
            payout: contracts[1].payout,
            purchase: contracts[1].buy_price,
            reference: contracts[1].transaction_id,
            type: contracts[1].contract_type,
        });
        expect(mockedPortfolioStore.getPositionById('incorrect-id')).toEqual(undefined);
        expect(mockedPortfolioStore.getPositionById(null)).toEqual(undefined);
        expect(mockedPortfolioStore.getPositionById(undefined)).toEqual(undefined);
    });
});
