import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { mockContractInfo } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import OpenPositions from '../open-positions';
import ReportsProviders from '../../reports-providers';

const data_list = 'DataList';
const future_time = Math.floor(Date.now() / 1000) + 5000;
const options_position = {
    contract_info: mockContractInfo({
        bid_price: 9.52,
        buy_price: 10,
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

    it('should render filter dropdown with Options selected by default & with DataTable on desktop', () => {
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent(options);
        expect(screen.getByTestId(data_table_test_id)).toBeInTheDocument();
    });
    it('should render filter dropdown with Options selected by default & with DataList for mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue(options);
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
    it('should render notifications and No positions message but no filter and no Datalist if positions are empty on mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        store.portfolio.active_positions = [];
        render(mockedOpenPositions());

        expect(screen.getByText(notifications)).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        expect(screen.queryByText(data_list)).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should render filter dropdown with Options selected if is_multiplier and is_accumulator are false in portfolio-store', () => {
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent(options);
        expect(screen.getByText(Math.abs(options_position.profit_loss))).toBeInTheDocument();
        expect(screen.queryByText(multipliers_profit)).not.toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });
    it('should render filter dropdown with Multipliers selected if is_multiplier is true in portfolio-store', () => {
        store.portfolio.is_multiplier = true;
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent(multipliers);
        expect(screen.queryByText(Math.abs(options_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.getByText(multipliers_profit)).toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });
    it('should render filter dropdown with Accumulators selected if is_accumulator is true in portfolio-store', () => {
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByTestId(filter_dropdown)).toHaveLength(2);
        expect(screen.getAllByTestId(filter_dropdown)[0]).toHaveTextContent(accumulators);
        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent(all_growth_rates);
        expect(screen.queryByText(Math.abs(options_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.queryByText(multipliers_profit)).not.toBeInTheDocument();
        expect(screen.getByText(Math.abs(accumulators_position.profit_loss))).toBeInTheDocument();
    });
    it('should render filter dropdown without Accumulators among options when is_eu is true in client-store', () => {
        store.client.is_eu = true;
        store.portfolio.active_positions = [multipliers_position, options_position]; // EU client cannot have Accumulators positions
        render(mockedOpenPositions());

        userEvent.click(screen.getByTestId(filter_dropdown));
        expect(screen.getAllByText(options)).toHaveLength(2); // Options is displayed twice: as a selected option and among filter options
        expect(screen.getByText(multipliers)).toBeInTheDocument();
        expect(screen.queryByText(accumulators)).not.toBeInTheDocument();
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
        store.portfolio.is_loading = true;
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent(options);
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByTestId(loading_test_id)).toBeInTheDocument();
    });
    it('should set Multipliers filter when it is selected from the dropdown on desktop', () => {
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent(options);
        userEvent.click(screen.getByText(options));
        userEvent.click(screen.getByText(multipliers));
        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent(multipliers);
    });
    it('should set Accumulators filter when it is selected from the dropdown on mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        render(mockedOpenPositions());

        expect(screen.getByRole('combobox')).toHaveValue(options);
        userEvent.selectOptions(screen.getByRole('combobox'), accumulators);
        expect(screen.getAllByRole('combobox')[0]).toHaveValue(accumulators);
    });
    it('should set 1% Growth rate filter when it is selected from the dropdown for Accumulators on desktop', () => {
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent(all_growth_rates);
        userEvent.click(screen.getByText(all_growth_rates));
        userEvent.click(screen.getByText(one_percent));
        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent(one_percent);
    });
    it('should set 5% Growth rate filter when it is selected from the dropdown for Accumulators on mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByRole('combobox')[1]).toHaveValue(all_growth_rates);
        userEvent.selectOptions(screen.getAllByRole('combobox')[1], five_percent);
        expect(screen.getAllByRole('combobox')[1]).toHaveValue(five_percent);
    });
});
