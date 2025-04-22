import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { mockContractInfo } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { TPortfolioPosition } from '@deriv/stores/types';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReportsProviders from '../../reports-providers';
import OpenPositions from '../open-positions';

const data_list = 'DataList';
const base_time = Math.floor(Date.now() / 1000);
const future_time = base_time + 5000;
const options_position = {
    contract_info: mockContractInfo({
        bid_price: 9.52,
        buy_price: 10,
        date_start: base_time,
        shortcode: `CALL_R_100_19.73_1718630564_${future_time}_S0P_0`,
    }),
    details:
        'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
    display_name: '',
    id: 246179185288,
    indicative: 9.52,
    payout: 19.73,
    purchase: 10,
    reference: 490752972668,
    type: 'CALL',
    profit_loss: -0.48,
    is_valid_to_sell: true,
    status: 'loss',
    barrier: 1184.99,
    entry_spot: 1184.99,
} as TPortfolioPosition;

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DataList: jest.fn(() => <>{data_list}</>),
}));

describe('OpenPositions', () => {
    let store = mockStore({});
    const data_table_test_id = 'dt_data_table';
    const filter_dropdown = 'dt_dropdown_display';
    const loading_test_id = 'dt_loading_component';
    const mocked_error_message = 'Error message';
    const no_open_positions_text = 'You have no open positions yet.';
    const notifications = 'NotificationMessages';

    const accumulators = 'Accumulators';
    const multipliers = 'Multipliers';
    const options = 'Options';

    const all_growth_rates = 'All growth rates';
    const one_percent = '1%';
    const five_percent = '5%';

    const accumulators_position = {
        contract_info: mockContractInfo({
            bid_price: 11.38,
            buy_price: 10,
            contract_type: 'ACCU',
            date_start: base_time + 2000,
            growth_rate: 0.01,
            shortcode: 'ACCU_R_100_10.00_0_0.01_1_0.000612552024_1718716983',
        }),
        details:
            'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06126% from the previous spot price.',
        display_name: 'Volatility 100 Index',
        id: 246292539368,
        indicative: 11.38,
        purchase: 10,
        reference: 490979574948,
        type: 'ACCU',
        contract_update: {
            take_profit: {
                display_name: 'Take profit',
                order_amount: 60,
                order_date: 1718716983,
            },
        },
        profit_loss: 1.38,
        is_valid_to_sell: true,
        current_tick: 13,
        status: 'profit',
        entry_spot: 1100.28,
        high_barrier: 1100.714,
        low_barrier: 1099.366,
    } as TPortfolioPosition;
    const multipliers_position = {
        contract_info: mockContractInfo({
            bid_price: 10.09,
            buy_price: 11.29,
            contract_type: 'MULTUP',
            date_start: base_time + 1000,
            shortcode: `MULTUP_R_100_10.00_30_1718716675_${future_time}_60m_0.00_N1`,
        }),
        details:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 300, minus commissions.",
        display_name: 'Volatility 100 Index',
        id: 246291934908,
        indicative: 10.09,
        purchase: 11.29,
        reference: 490978376408,
        type: 'MULTUP',
        contract_update: {
            stop_out: {
                display_name: 'Stop out',
                order_amount: -10,
                order_date: 1718716675,
                value: '1058.84',
            },
        },
        entry_spot: 1094.94,
        profit_loss: 0.09,
        is_valid_to_sell: true,
        status: null,
    } as TPortfolioPosition;
    const multipliers_profit = '1.20';

    beforeEach(() => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: true }));

        store = mockStore({
            portfolio: {
                active_positions: [accumulators_position, multipliers_position, options_position],
            },
            client: {
                currency: 'USD',
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });
    });

    const mockedOpenPositions = () => {
        return (
            <ReportsProviders store={store}>
                <MemoryRouter>
                    <OpenPositions component_icon='IcOpenPositions' />
                </MemoryRouter>
            </ReportsProviders>
        );
    };

    it('should render filter dropdown with Accumulators selected by default since it is the latest contract & with DataTable on desktop', () => {
        // accumulators_position has the latest date_start
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        const dropdowns = screen.getAllByTestId(filter_dropdown);
        expect(dropdowns[0]).toHaveTextContent(accumulators);
        expect(screen.getByTestId(data_table_test_id)).toBeInTheDocument();
    });
    it('should render filter dropdown with Accumulators selected by default since it is the latest contract & with DataList for mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        const comboboxes = screen.getAllByRole('combobox');
        expect(comboboxes[0]).toHaveValue(accumulators.toLowerCase());
        expect(screen.getByText(data_list)).toBeInTheDocument();
    });
    it('should render notifications and No positions message but no filter and no DataTable if positions are empty on desktop', () => {
        store.portfolio.active_positions = [];
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        expect(screen.queryByTestId(filter_dropdown)).not.toBeInTheDocument();
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should default to Options when no positions are present and no sessionStorage value', () => {
        store.portfolio.active_positions = [];
        sessionStorage.removeItem('contract_type_value');
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        expect(screen.queryByTestId(filter_dropdown)).not.toBeInTheDocument();
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should render notifications and No positions message but no filter and no Datalist if positions are empty on mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        store.portfolio.active_positions = [];
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        expect(screen.queryByText(data_list)).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should render filter dropdown with Options selected when only options positions are present', () => {
        store = mockStore({
            portfolio: {
                active_positions: [options_position],
            },
            client: {
                currency: 'USD',
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });
        render(mockedOpenPositions());

        const dropdowns = screen.getAllByTestId(filter_dropdown);
        expect(dropdowns[0]).toHaveTextContent(options);
        expect(screen.getByText(Math.abs(options_position.profit_loss))).toBeInTheDocument();
        expect(screen.queryByText(multipliers_profit)).not.toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });

    it('should render error if it is defined', () => {
        store.portfolio.error = mocked_error_message;
        render(mockedOpenPositions());

        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByText(mocked_error_message)).toBeInTheDocument();
    });
    it('should render Loading when positions are empty & is_loading is true in portfolio-store', () => {
        store.portfolio.active_positions = [];
        store.portfolio.is_loading = true;
        render(mockedOpenPositions());

        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByTestId(loading_test_id)).toBeInTheDocument();
    });
    it('should render filter dropdown together with Loading when positions are available & is_loading === true', () => {
        store = mockStore({
            portfolio: {
                active_positions: [accumulators_position, multipliers_position, options_position],
                is_loading: true,
            },
            client: {
                currency: 'USD',
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });
        render(mockedOpenPositions());

        const dropdowns = screen.getAllByTestId(filter_dropdown);
        expect(dropdowns[0]).toHaveTextContent(accumulators); // Should show accumulators as it has the latest date_start
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByTestId(loading_test_id)).toBeInTheDocument();
    });
    it('should set Multipliers filter when it is selected from the dropdown on desktop', async () => {
        store = mockStore({
            portfolio: {
                active_positions: [options_position],
            },
            client: {
                currency: 'USD',
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });
        const { rerender } = render(mockedOpenPositions());

        const dropdown = screen.getByTestId(filter_dropdown);
        expect(dropdown).toHaveTextContent(options);
        await userEvent.click(screen.getByText(options));
        rerender(mockedOpenPositions());
        await userEvent.click(screen.getByText(multipliers));

        expect(dropdown).toHaveTextContent(multipliers);
    });
    // Create a mock implementation of sessionStorage
    beforeEach(() => {
        const sessionStorageMock = (() => {
            let store: Record<string, string> = {};
            return {
                getItem: jest.fn((key: string) => store[key] || null),
                setItem: jest.fn((key: string, value: string) => {
                    store[key] = value;
                }),
                removeItem: jest.fn((key: string) => {
                    delete store[key];
                }),
                clear: jest.fn(() => {
                    store = {};
                }),
            };
        })();

        // Override the sessionStorage property
        Object.defineProperty(window, 'sessionStorage', {
            value: sessionStorageMock,
            writable: true,
        });
    });

    it('should set 1% Growth rate filter when it is selected from the dropdown for Accumulators on desktop', async () => {
        // Set sessionStorage to return 'accumulators'
        (window.sessionStorage.getItem as jest.Mock).mockReturnValue('accumulators');

        store = mockStore({
            portfolio: {
                active_positions: [accumulators_position],
            },
            client: {
                currency: 'USD',
                is_eu: false, // Ensure hide_accu_in_dropdown is false
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });
        render(mockedOpenPositions());

        const dropdowns = screen.getAllByTestId(filter_dropdown);
        // Check dropdowns
        expect(dropdowns[1]).toHaveTextContent(all_growth_rates);
        await userEvent.click(dropdowns[1]);
        await userEvent.click(screen.getByText(one_percent));
        expect(dropdowns[1]).toHaveTextContent(one_percent);
    });
    it('should set 5% Growth rate filter when it is selected from the dropdown for Accumulators on mobile', async () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));

        // Set sessionStorage to return 'accumulators'
        (window.sessionStorage.getItem as jest.Mock).mockReturnValue('accumulators');

        store = mockStore({
            portfolio: {
                active_positions: [accumulators_position],
            },
            client: {
                currency: 'USD',
                is_eu: false, // Ensure hide_accu_in_dropdown is false
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });
        render(mockedOpenPositions());

        const comboboxes = screen.getAllByRole('combobox');
        expect(comboboxes[1]).toHaveValue(all_growth_rates.toLowerCase());
        await userEvent.selectOptions(comboboxes[1], five_percent);
        expect(comboboxes[1]).toHaveValue(five_percent);
    });

    // Clean up sessionStorage mock after all tests
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should persist contract type selection in sessionStorage', async () => {
        // Start with no stored value
        sessionStorage.removeItem('contract_type_value');

        // Use only options_position to ensure we know the default selection
        store = mockStore({
            portfolio: {
                active_positions: [options_position],
            },
            client: {
                currency: 'USD',
            },
            ui: {
                notification_messages_ui: () => <div>{notifications}</div>,
            },
        });

        const { rerender } = render(mockedOpenPositions());

        // Verify initial selection is Options
        const dropdown = screen.getByTestId(filter_dropdown);
        expect(dropdown).toHaveTextContent(options);

        // Change selection to multipliers
        await userEvent.click(dropdown);
        await userEvent.click(screen.getByText(multipliers));

        // Verify sessionStorage was called with the correct values
        expect(window.sessionStorage.setItem).toHaveBeenCalledWith('contract_type_value', 'multipliers');

        // Simulate page refresh by re-rendering with the stored value
        (window.sessionStorage.getItem as jest.Mock).mockReturnValue('multipliers');
        rerender(mockedOpenPositions());

        // Verify the stored value is used after refresh
        expect(dropdown).toHaveTextContent(multipliers);
    });
});
