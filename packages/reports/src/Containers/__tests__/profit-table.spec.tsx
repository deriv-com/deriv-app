import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfitTable, { getRowAction } from '../profit-table';
import { mockStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import ReportsProviders from '../../reports-providers';
import { useReportsStore } from 'Stores/useReportsStores';
import { extractInfoFromShortcode, formatDate, getUnsupportedContracts } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';

const mockData = [
    {
        app_id: 36300,
        buy_price: 9.39,
        contract_id: 3213,
        action_type: 'sell',
        contract_type: 'MULTUP',
        deal_cancellation_duration: '60m',
        duration_type: 'days',
        currency: 'USD',
        longcode:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 90, minus commissions.",
        multiplier: '10',
        payout: 0,
        purchase_time: 1718852828,
        sell_price: 9,
        sell_time: 1718852980,
        shortcode: 'MULTUP_1HZ100V_9.00_10_1718852828_4872527999_60m_0.00_N1',
        transaction_id: 491371640048,
        profit_loss: '20',
        underlying_symbol: '1HZ100V',
    },
    {
        app_id: 321323,
        buy_price: 1.39,
        action_type: 'sell',
        contract_id: 312321312,
        currency: 'USD',
        contract_type: 'MULTUP',
        deal_cancellation_duration: '12m',
        duration_type: 'seconds',
        longcode:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 90, minus commissions.",
        multiplier: '1',
        payout: 0,
        purchase_time: 3213123312,
        sell_price: 9,
        sell_time: 3213123123,
        shortcode: 'MULTUP_',
        profit_loss: '2',
        transaction_id: 321312312312312,
        underlying_symbol: '1HZ100V',
    },
];

jest.mock('@deriv-com/analytics', () => ({
    Analytics: {
        trackEvent: jest.fn(),
    },
}));

jest.mock('Stores/useReportsStores', () => ({
    ...jest.requireActual('Stores/useReportsStores'),
    useReportsStore: jest.fn(() => ({
        profit_table: {
            action_type: 'all',
            data: [],
            is_switching: false,
            date_from: null,
            date_to: 1717631999,
            has_selected_date: true,
            handleScroll: jest.fn(),
            is_empty: true,
            is_loading: false,
            onMount: jest.fn(),
            onUnmount: jest.fn(),
            handleDateChange: jest.fn(),
        },
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({
        isDesktop: true,
        isMobile: false,
        isTablet: false,
    })),
}));

jest.mock('react-virtualized', () => {
    const actual = jest.requireActual('react-virtualized');
    return {
        ...actual,
        AutoSizer: ({ children }: { children: (dimensions: { width: number; height: number }) => React.ReactNode }) =>
            children({ width: 800, height: 600 }),
    };
});

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        forgetAll: jest.fn(),
        wait: jest.fn(),
        statement: jest.fn().mockReturnValue({
            statement: {
                transactions: [
                    {
                        action_type: 'sell',
                        amount: 11,
                        app_id: 2,
                        balance_after: 8866.19,
                        contract_id: 243990619668,
                        longcode:
                            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 50, minus commissions.",
                        payout: 0,
                        purchase_time: 1717078783,
                        reference_id: 486589408728,
                        shortcode: 'MULTUP_R_100_5.00_10_1717078783_4870713599_0_6.00_N1',
                        transaction_id: 487679411128,
                        transaction_time: 1717465636,
                    },
                    {
                        action_type: 'buy',
                        amount: -10,
                        app_id: 36300,
                        balance_after: 8845.35,
                        contract_id: 244170956768,
                        longcode:
                            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 100, minus commissions.",
                        payout: 0,
                        reference_id: null,
                        shortcode: 'MULTUP_1HZ100V_10.00_10_1717184563_4870799999_0_33.00_N1',
                        transaction_id: 486932886768,
                        transaction_time: 1717184562,
                    },
                    {
                        action_type: 'deposit',
                        amount: 1000,
                        balance_after: 1000,
                        transaction_id: 17494117539,
                        transaction_time: 1685769338,
                    },
                ],
            },
        }),
    },
    extractInfoFromShortcode: jest.fn(() => ({
        category: 'unsupported',
    })),
    getUnsupportedContracts: jest.fn(() => ({
        UNSUPPORTED: { name: 'Unsupported Contract' },
    })),
    getContractPath: jest.fn(() => 'path/to/supported/contract'),
}));

describe('getRowAction', () => {
    const contractPath = 'path/to/supported/contract';
    beforeEach(() => {
        jest.clearAllMocks();
        (getUnsupportedContracts as jest.Mock).mockReturnValue({
            UNSUPPORTED: { name: 'Unsupported Contract' },
        });
    });

    it('should return a component for unsupported contract types', () => {
        const row_obj = { shortcode: 'shortcode_for_unsupported', contract_id: '123' };
        const result = getRowAction(row_obj);
        if (typeof result === 'string') {
            throw new Error('Expected a component but got a string');
        }
        expect(result).toHaveProperty('component');
        expect(result.component).toEqual(expect.any(Object));
    });

    it('should return contract path for supported contract types', () => {
        (extractInfoFromShortcode as jest.Mock).mockReturnValue({ category: 'supported' });
        (getUnsupportedContracts as jest.Mock).mockReturnValue({});
        const row_obj = { shortcode: 'shortcode_for_supported', contract_id: '123' };
        const result = getRowAction(row_obj);
        expect(result).toEqual(contractPath);
    });
});

describe('Profit Table', () => {
    let store = mockStore({});
    const longCodeMessage = "You've made no transactions of this type during this period.";
    const shortCodeMessage = 'You have no trading activity yet.';
    const calendarIcon = 'dt_calendar_icon';
    const dataList = 'dt_data_list';
    const loader = 'dt_loading_component';
    const dataTable = 'dt_data_table';
    const errorMessage = 'Error loading data';
    const footerContent = 'Profit/loss on the last 2 contracts';
    const durationType = 'Days';

    const renderProfitTable = () => {
        render(
            <ReportsProviders store={store}>
                <MemoryRouter>
                    <ProfitTable />
                </MemoryRouter>
            </ReportsProviders>
        );
    };

    beforeEach(() => {
        store = mockStore({});
    });

    test('renders the ProfitTable component correctly and shows long message if no data is present', () => {
        renderProfitTable();
        expect(screen.getByText(longCodeMessage)).toBeInTheDocument();
    });

    test('renders the ProfitTable component correctly and shows short message if no data is present and has_selected_date is false', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: [],
                is_empty: true,
                is_loading: false,
                has_selected_date: false,
            },
        });
        renderProfitTable();
        expect(screen.getByText(shortCodeMessage)).toBeInTheDocument();
    });

    test('renders filter but no list if the data is empty on desktop', () => {
        renderProfitTable();
        expect(screen.getAllByTestId(calendarIcon).length).toBeGreaterThan(0);
    });

    test('displays a loading indicator when data is loading', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: [{}],
                is_empty: false,
                is_loading: true,
            },
        });
        renderProfitTable();
        expect(screen.getByTestId(loader)).toBeInTheDocument();
    });

    test('renders loading indicator when is_switching is true', () => {
        store.client.is_switching = true;
        renderProfitTable();
        expect(screen.queryByTestId(dataTable)).not.toBeInTheDocument();
        expect(screen.getByTestId(loader)).toBeInTheDocument();
    });

    test('displays an error message when there is an error', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: [{}],
                is_empty: false,
                is_loading: true,
                error: errorMessage,
            },
        });
        renderProfitTable();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('tracks Analytics events on date changes', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: [{}],
                date_from: '31/01/2024',
                date_to: '01/02/2024',
                is_empty: false,
                is_loading: true,
            },
        });
        renderProfitTable();
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            'ce_reports_form',
            expect.objectContaining({
                action: 'choose_report_type',
                start_date_filter: formatDate('31/01/2024', 'DD/MM/YYYY', false),
                end_date_filter: formatDate('01/02/2024', 'DD/MM/YYYY', false),
                subform_name: 'trade_table_form',
                form_name: 'default',
            })
        );
    });

    test('renders data table when data is available', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                is_loading: false,
                is_empty: false,
                data: mockData,
            },
        });
        renderProfitTable();
        expect(screen.getByTestId(dataTable)).toBeInTheDocument();
    });

    test('renders datepicker but no DataList if data is empty on mobile', () => {
        (useDevice as jest.Mock).mockReturnValue({
            isMobile: true,
        });
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: [],
            },
        });
        renderProfitTable();
        expect(screen.queryByTestId(dataList)).not.toBeInTheDocument();
    });

    test('renders footer when is_footer prop is true on mobile', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: [],
                totals: {},
            },
        });
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: false,
        });
        renderProfitTable();
        expect(screen.queryByTestId(dataList)).not.toBeInTheDocument();
    });

    test('shows footer on mobile screen when totals is passed', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: mockData,
                totals: { total: 1000, profit_loss: '120' },
                is_empty: false,
            },
        });
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: false,
        });
        renderProfitTable();
        expect(screen.getAllByText(footerContent).length).toBeGreaterThan(0);
    });

    test('shows data on mobile screen', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            profit_table: {
                ...useReportsStore().profit_table,
                data: mockData,
                handleScroll: jest.fn(),
                is_empty: false,
            },
        });
        (useDevice as jest.Mock).mockReturnValue({
            isDesktop: false,
        });
        renderProfitTable();
        expect(screen.getByText(durationType)).toBeInTheDocument();
    });
});
