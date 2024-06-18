import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { isDesktop, isMobile } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import OpenPositions, { OpenPositionsTable, getRowAction, isPurchaseReceived } from '../open-positions';
import ReportsProviders from '../../reports-providers';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DataList: jest.fn(() => <>DataList</>),
}));

const future_time = Math.floor(Date.now() / 1000) + 5000;
const options_position = {
    contract_info: {
        account_id: 112905368,
        barrier: '1184.99',
        barrier_count: 1,
        bid_price: 9.52,
        buy_price: 10,
        contract_id: 246179185288,
        contract_type: 'CALL',
        currency: 'USD',
        current_spot: 1184.95,
        current_spot_display_value: '1184.95',
        current_spot_time: 1718630678,
        date_expiry: future_time,
        date_settlement: future_time,
        date_start: 1718630564,
        display_name: 'Volatility 100 Index',
        entry_spot: 1184.99,
        entry_spot_display_value: '1184.99',
        entry_tick: 1184.99,
        entry_tick_display_value: '1184.99',
        entry_tick_time: 1718630566,
        expiry_time: future_time,
        id: '6838091b-05ce-7872-3131-eedddd394422',
        is_expired: 0,
        is_forward_starting: 0,
        is_intraday: 1,
        is_path_dependent: 0,
        is_settleable: 0,
        is_sold: 0,
        is_valid_to_cancel: 0,
        is_valid_to_sell: 1,
        longcode:
            'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
        payout: 19.73,
        profit: -0.48,
        profit_percentage: -4.8,
        purchase_time: 1718630564,
        shortcode: `CALL_R_100_19.73_1718630564_${future_time}_S0P_0`,
        status: 'open',
        transaction_ids: {
            buy: 490752972668,
        },
        underlying: 'R_100',
    },
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

describe('OpenPositions', () => {
    let store = mockStore({});
    const data_table_test_id = 'dt_data_table';
    const filter_dropdown = 'dt_dropdown_display';
    const loading_test_id = 'dt_loading_component';
    const mocked_error_message = 'Error message';
    const no_open_positions_text = 'You have no open positions yet.';
    const accumulators_position = {
        contract_info: {
            account_id: 112905368,
            barrier_count: 2,
            barrier_spot_distance: '0.675',
            bid_price: 11.38,
            buy_price: 10,
            contract_id: 246292539368,
            contract_type: 'ACCU',
            currency: 'USD',
            current_spot: 1100.38,
            current_spot_display_value: '1100.38',
            current_spot_high_barrier: '1101.055',
            current_spot_low_barrier: '1099.705',
            current_spot_time: 1718717010,
            date_expiry: future_time,
            date_settlement: future_time,
            date_start: 1718716983,
            display_name: 'Volatility 100 Index',
            entry_spot: 1100.28,
            entry_spot_display_value: '1100.28',
            entry_tick: 1100.28,
            entry_tick_display_value: '1100.28',
            entry_tick_time: 1718716984,
            expiry_time: future_time,
            growth_rate: 0.01,
            high_barrier: '1100.714',
            id: '51bb838f-c549-0389-9be1-ace068906f5d',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 0,
            is_path_dependent: 1,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 0,
            is_valid_to_sell: 1,
            limit_order: {
                take_profit: {
                    display_name: 'Take profit',
                    order_amount: 60,
                    order_date: 1718716983,
                },
            },
            longcode:
                'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06126% from the previous spot price.',
            low_barrier: '1099.366',
            profit: 1.38,
            profit_percentage: 13.8,
            purchase_time: 1718716983,
            shortcode: 'ACCU_R_100_10.00_0_0.01_1_0.000612552024_1718716983',
            status: 'open',
            tick_count: 230,
            tick_passed: 13,
            tick_stream: [
                {
                    epoch: 1718716992,
                    tick: 1099.84,
                    tick_display_value: '1099.84',
                },
                {
                    epoch: 1718716994,
                    tick: 1099.71,
                    tick_display_value: '1099.71',
                },
                {
                    epoch: 1718716996,
                    tick: 1100.17,
                    tick_display_value: '1100.17',
                },
                {
                    epoch: 1718716998,
                    tick: 1100.19,
                    tick_display_value: '1100.19',
                },
                {
                    epoch: 1718717000,
                    tick: 1100.19,
                    tick_display_value: '1100.19',
                },
                {
                    epoch: 1718717002,
                    tick: 1100.19,
                    tick_display_value: '1100.19',
                },
                {
                    epoch: 1718717004,
                    tick: 1099.87,
                    tick_display_value: '1099.87',
                },
                {
                    epoch: 1718717006,
                    tick: 1099.67,
                    tick_display_value: '1099.67',
                },
                {
                    epoch: 1718717008,
                    tick: 1100.04,
                    tick_display_value: '1100.04',
                },
                {
                    epoch: 1718717010,
                    tick: 1100.38,
                    tick_display_value: '1100.38',
                },
            ],
            transaction_ids: {
                buy: 490979574948,
            },
            underlying: 'R_100',
        },
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
        contract_info: {
            account_id: 112905368,
            barrier_count: 1,
            bid_price: 10.09,
            buy_price: 11.29,
            cancellation: {
                ask_price: 1.29,
                date_expiry: future_time,
            },
            commission: 0.11,
            contract_id: 246291934908,
            contract_type: 'MULTUP',
            currency: 'USD',
            current_spot: 1095.68,
            current_spot_display_value: '1095.68',
            current_spot_time: 1718716822,
            date_expiry: future_time,
            date_settlement: future_time,
            date_start: 1718716675,
            display_name: 'Volatility 100 Index',
            entry_spot: 1094.94,
            entry_spot_display_value: '1094.94',
            entry_tick: 1094.94,
            entry_tick_display_value: '1094.94',
            entry_tick_time: 1718716676,
            expiry_time: future_time,
            id: '51bb838f-c549-0389-9be1-ace068906f5d',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 0,
            is_path_dependent: 1,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 1,
            is_valid_to_sell: 1,
            limit_order: {
                stop_out: {
                    display_name: 'Stop out',
                    order_amount: -10,
                    order_date: 1718716675,
                    value: '1058.84',
                },
            },
            longcode:
                "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 300, minus commissions.",
            multiplier: 30,
            profit: 0.09,
            profit_percentage: 0.9,
            purchase_time: 1718716675,
            shortcode: `MULTUP_R_100_10.00_30_1718716675_${future_time}_60m_0.00_N1`,
            status: 'open',
            transaction_ids: {
                buy: 490978376408,
            },
            underlying: 'R_100',
        },
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
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);

        store = mockStore({
            portfolio: {
                active_positions: [accumulators_position, multipliers_position, options_position],
            },
            client: {
                currency: 'USD',
            },
            ui: {
                notification_messages_ui: () => <div>NotificationMessages</div>,
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

        expect(screen.getByText('NotificationMessages')).toBeInTheDocument();
        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Options');
        expect(screen.getByTestId(data_table_test_id)).toBeInTheDocument();
    });
    it('should render filter dropdown with Options selected by default & with DataList for mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(mockedOpenPositions());

        expect(screen.getByText('NotificationMessages')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toHaveValue('Options');
        expect(screen.getByText('DataList')).toBeInTheDocument();
    });
    it('should render NotificationMessages and No positions message but no filter and no DataTable if positions are empty on desktop', () => {
        store.portfolio.active_positions = [];
        render(mockedOpenPositions());

        expect(screen.getByText('NotificationMessages')).toBeInTheDocument();
        expect(screen.queryByTestId(filter_dropdown)).not.toBeInTheDocument();
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should render NotificationMessages and No positions message but no filter and no Datalist if positions are empty on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        store.portfolio.active_positions = [];
        render(mockedOpenPositions());

        expect(screen.getByText('NotificationMessages')).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        expect(screen.queryByText('Datalist')).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should render filter dropdown with Options selected if is_multiplier and is_accumulator are false in portfolio-store', () => {
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Options');
        expect(screen.getByText(Math.abs(options_position.profit_loss))).toBeInTheDocument();
        expect(screen.queryByText(multipliers_profit)).not.toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });
    it('should render filter dropdown with Multipliers selected if is_multiplier is true in portfolio-store', () => {
        store.portfolio.is_multiplier = true;
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Multipliers');
        expect(screen.queryByText(Math.abs(options_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.getByText(multipliers_profit)).toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });
    it('should render filter dropdown with Accumulators selected if is_accumulator is true in portfolio-store', () => {
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByTestId(filter_dropdown)).toHaveLength(2);
        expect(screen.getAllByTestId(filter_dropdown)[0]).toHaveTextContent('Accumulators');
        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent('All growth rates');
        expect(screen.queryByText(Math.abs(options_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.queryByText(multipliers_profit)).not.toBeInTheDocument();
        expect(screen.getByText(Math.abs(accumulators_position.profit_loss))).toBeInTheDocument();
    });
    it('should render filter dropdown without Accumulators among options when is_eu is true in client-store', () => {
        store.client.is_eu = true;
        store.portfolio.active_positions = [multipliers_position, options_position]; // EU client cannot have Accumulators positions
        render(mockedOpenPositions());

        userEvent.click(screen.getByTestId(filter_dropdown));
        expect(screen.getAllByText('Options')).toHaveLength(2); // Options is displayed twice: as a selected option and among filter options
        expect(screen.getByText('Multipliers')).toBeInTheDocument();
        expect(screen.queryByText('Accumulators')).not.toBeInTheDocument();
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

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Options');
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByTestId(loading_test_id)).toBeInTheDocument();
    });
    it('should set Multipliers filter when it is selected from the dropdown on desktop', () => {
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Options');
        userEvent.click(screen.getByText('Options'));
        userEvent.click(screen.getByText('Multipliers'));
        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Multipliers');
    });
    it('should set Accumulators filter when it is selected from the dropdown on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(mockedOpenPositions());

        expect(screen.getByRole('combobox')).toHaveValue('Options');
        userEvent.selectOptions(screen.getByRole('combobox'), 'Accumulators');
        expect(screen.getAllByRole('combobox')[0]).toHaveValue('Accumulators');
    });
    it('should set 1% Growth rate filter when it is selected from the dropdown for Accumulators on desktop', () => {
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent('All growth rates');
        userEvent.click(screen.getByText('All growth rates'));
        userEvent.click(screen.getByText('1%'));
        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent('1%');
    });
    it('should set 5% Growth rate filter when it is selected from the dropdown for Accumulators on mobile', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByRole('combobox')[1]).toHaveValue('All growth rates');
        userEvent.selectOptions(screen.getAllByRole('combobox')[1], '5%');
        expect(screen.getAllByRole('combobox')[1]).toHaveValue('5%');
    });
});

describe('isPurchaseReceived', () => {
    it('should return true if purchase value (position purchase) is 0 / NaN / undefined', () => {
        expect(isPurchaseReceived({ purchase: 0 })).toBe(true);
        expect(isPurchaseReceived({ purchase: NaN })).toBe(true);
        expect(isPurchaseReceived({})).toBe(true);
    });
    it('should return false if purchase value (position purchase) is a non-zero number', () => {
        expect(isPurchaseReceived({ purchase: 10 })).toBe(false);
        expect(isPurchaseReceived({ purchase: 1.55 })).toBe(false);
    });
});

describe('getRowAction', () => {
    it('should return an empty object if received data is an empty object, or if contract_info and id are missing in it', () => {
        expect(getRowAction()).toMatchObject({});
        expect(getRowAction({})).toMatchObject({});
        expect(getRowAction({ ...options_position, id: '', contract_info: undefined })).toMatchObject({});
        expect(getRowAction({ ...options_position, id: '', contract_info: undefined, type: '' })).toMatchObject({});
    });
    it('should return contract path string if received data has an id, and if contract is not unsupported or forward-starting', () => {
        expect(getRowAction({ id: options_position.id })).toEqual(`/contract/${options_position.id}`);
        expect(getRowAction(options_position)).toEqual(`/contract/${options_position.id}`);
    });
    it('should return an object with component that renders a correct message if contract type is unsupported', () => {
        render(
            (
                getRowAction({
                    ...options_position,
                    type: 'CALLSPREAD',
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText(/contract details aren't currently available/i)).toBeInTheDocument();
    });
    it('should return an object with component that renders a correct message if contract is forward-starting', () => {
        render(
            (
                getRowAction({
                    ...options_position,
                    contract_info: {
                        ...options_position.contract_info,
                        current_spot_time: 1717662763,
                        date_start: future_time,
                    },
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText("You'll see these details once the contract starts.")).toBeInTheDocument();
    });
});

describe('OpenPositionsTable', () => {
    beforeEach(() => {
        (isMobile as jest.Mock).mockReturnValue(false);
        (isDesktop as jest.Mock).mockReturnValue(true);
    });

    it('should render "Loading" component when "is_loading" property is passed and it\'s value is "true"', () => {
        render(<OpenPositionsTable is_loading />);
        expect(screen.getByTestId('dt_loading_component')).toBeInTheDocument();
    });

    it('should render "DataTable" component and it\'s properties when "is_loading" property is "false" and the "currency" property is passed in the "desktop" view', () => {
        render(<OpenPositionsTable currency='USD' active_positions={[100]} columns={[]} className='test-class' />);
        expect(screen.getByTestId('dt_data_table')).toBeInTheDocument();
        expect(screen.getByTestId('dt_data_table')).toHaveClass('test-class');
    });

    it('should render "DataList" component and it\'s properties when "is_loading" property is "false" and the "currency" property is passed in the "mobile" view', () => {
        isMobile.mockReturnValue(true);
        render(<OpenPositionsTable currency='USD' active_positions={[100]} columns={[]} className='test-class' />);
        expect(screen.getByText('DataList')).toBeInTheDocument();
    });
});
