import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { isDesktop, isMobile } from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { mockStore } from '@deriv/stores';
import OpenPositions, { OpenPositionsTable } from '../open-positions';
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

describe('OpenPositions', () => {
    let store = mockStore({});
    const data_table_test_id = 'dt_data_table';
    const filter_dropdown = 'dt_dropdown_display';
    const loading_test_id = 'dt_loading_component';
    const mocked_error_message = 'Error message';
    const no_open_positions_text = 'You have no open positions yet.';
    const expiry_time = Math.floor(Date.now() / 1000) + 5000;
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
            date_expiry: expiry_time,
            date_settlement: expiry_time,
            date_start: 1718716983,
            display_name: 'Volatility 100 Index',
            entry_spot: 1100.28,
            entry_spot_display_value: '1100.28',
            entry_tick: 1100.28,
            entry_tick_display_value: '1100.28',
            entry_tick_time: 1718716984,
            expiry_time,
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
                date_expiry: expiry_time,
            },
            commission: 0.11,
            contract_id: 246291934908,
            contract_type: 'MULTUP',
            currency: 'USD',
            current_spot: 1095.68,
            current_spot_display_value: '1095.68',
            current_spot_time: 1718716822,
            date_expiry: expiry_time,
            date_settlement: expiry_time,
            date_start: 1718716675,
            display_name: 'Volatility 100 Index',
            entry_spot: 1094.94,
            entry_spot_display_value: '1094.94',
            entry_tick: 1094.94,
            entry_tick_display_value: '1094.94',
            entry_tick_time: 1718716676,
            expiry_time,
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
            shortcode: `MULTUP_R_100_10.00_30_1718716675_${expiry_time}_60m_0.00_N1`,
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
            date_expiry: expiry_time,
            date_settlement: expiry_time,
            date_start: 1718630564,
            display_name: 'Volatility 100 Index',
            entry_spot: 1184.99,
            entry_spot_display_value: '1184.99',
            entry_tick: 1184.99,
            entry_tick_display_value: '1184.99',
            entry_tick_time: 1718630566,
            expiry_time,
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
            shortcode: `CALL_R_100_19.73_1718630564_${expiry_time}_S0P_0`,
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

// describe('getRowAction', () => {
//     const copyIcon = 'Copy icon';
//     const blockchainAddress = 'tb1qhu8ksh4ylvzycycm9e0eh3wy6fcxfp7g272qgi';
//     const blockchainTransaction = '3afb4aea5c6c250779ab2069f7bfaae87c64c3f64a116c251806b8e650513d27';
//     const blockchainDesc = `address: ${blockchainAddress}, transaction: ${blockchainTransaction}`;
//     const blockchainAddressText = `Address: ${blockchainAddress},`;
//     const blockchainTransactionText = `Transaction: ${blockchainTransaction}`;
//     const contractDetailsUnavailableText = /contract details aren't currently available/i;
//     const longcodeDescription =
//         'Win payout if Volatility 100 (1s) Index after 5 ticks is strictly higher than entry spot.';
//     const unsupportedContractShortcode = 'CALLSPREAD_1HZ100V_66.87_1717660032_5T';

//     const riseContractData = {
//         balance: '0.00',
//         desc: longcodeDescription,
//         display_name: '',
//         id: 244821136548,
//         payout: '66.87',
//         shortcode: 'CALL_1HZ100V_66.87_1717660032_5T_S0P_0',
//     };
//     const buyTransactionData = {
//         ...riseContractData,
//         action: 'Buy',
//         action_type: 'buy',
//         amount: '-34.23',
//         app_id: 36300,
//         date: '06 Jun 2024 07:47:12',
//         refid: 488153867768,
//         transaction_time: 1717660032,
//     };
//     const sellTransactionData = {
//         ...riseContractData,
//         action: 'Sell',
//         action_type: 'sell',
//         amount: '0.00',
//         app_id: 2,
//         date: '06 Jun 2024 07:47:18',
//         purchase_time: 1717660032,
//         refid: 488153881108,
//         transaction_time: 1717660038,
//     };
//     const depositTransactionData = {
//         action: 'Deposit',
//         action_type: 'deposit',
//         amount: '10,000.00',
//         app_id: 36300,
//         balance: '10,000.00',
//         date: '06 Jun 2024 07:47:27',
//         desc: 'Reset to default demo account balance.',
//         display_name: '',
//         id: null,
//         payout: '-',
//         refid: 488153902708,
//         shortcode: null,
//         transaction_time: 1717660047,
//     };
//     const withdrawalTransactionData = {
//         action: 'Withdrawal',
//         action_type: 'withdrawal',
//         amount: '750.00',
//         app_id: 36300,
//         balance: '0.00',
//         date: '06 Jun 2024 08:47:27',
//         desc: 'Withdrawal message',
//         longcode: 'Withdrawal message',
//         refid: 243990619558,
//         transaction_time: 1717465636,
//         withdrawal_details: 'Withdrawal details',
//     };

//     it('should return an empty object if received data is an empty object, or if action_type is missing', () => {
//         expect(getRowAction({})).toMatchObject({});

//         expect(getRowAction({ ...buyTransactionData, action_type: '' })).toMatchObject({});
//     });
//     it('should return contract path string if row_obj has id, action_type is buy or sell, and contract is supported & not forward-starting', () => {
//         expect(getRowAction(buyTransactionData)).toEqual(`/contract/${buyTransactionData.id}`);

//         expect(getRowAction(sellTransactionData)).toEqual(`/contract/${sellTransactionData.id}`);
//     });
//     it('should return an object with component that renders desc if action_type is valid but not buy or sell', () => {
//         render((getRowAction(depositTransactionData) as Record<string, JSX.Element>).component);
//         expect(screen.getByText(depositTransactionData.desc)).toBeInTheDocument();
//     });
//     it('should return an object with component that renders withdrawal_details and longcode if action_type is withdrawal, & data includes withdrawal_details and longcode', () => {
//         render((getRowAction(withdrawalTransactionData) as Record<string, JSX.Element>).component);
//         expect(
//             screen.getByText(`${withdrawalTransactionData.withdrawal_details} ${withdrawalTransactionData.longcode}`)
//         ).toBeInTheDocument();
//     });
//     it('should return an object with component that renders desc if action_type is withdrawal, & withdrawal_details are missing', () => {
//         render(
//             (getRowAction({ ...withdrawalTransactionData, withdrawal_details: '' }) as Record<string, JSX.Element>)
//                 .component
//         );
//         expect(screen.getByText(withdrawalTransactionData.desc)).toBeInTheDocument();
//     });
//     it('should return an object with component that renders a correct message if action_type is buy or sell, & shortcode contains an unsupported contract_type', () => {
//         const { rerender } = render(
//             (
//                 getRowAction({
//                     ...sellTransactionData,
//                     shortcode: unsupportedContractShortcode,
//                 }) as Record<string, JSX.Element>
//             ).component
//         );
//         expect(screen.getByText(contractDetailsUnavailableText)).toBeInTheDocument();

//         rerender(
//             (
//                 getRowAction({
//                     ...buyTransactionData,
//                     shortcode: unsupportedContractShortcode,
//                 }) as Record<string, JSX.Element>
//             ).component
//         );
//         expect(screen.getByText(contractDetailsUnavailableText)).toBeInTheDocument();
//     });
//     it('should return an object with component that renders a correct message if action_type is buy, & shortcode contains forward-starting contract details', () => {
//         render(
//             (
//                 getRowAction({
//                     ...buyTransactionData,
//                     transaction_time: 1717662763,
//                     shortcode: `CALL_1HZ25V_19.54_${Math.floor(Date.now() / 1000) + 100}F_1717762800_S0P_0`,
//                     desc: 'Win payout if Volatility 25 (1s) Index is strictly higher than entry spot at 15 minutes after 2024-06-07 12:05:00 GMT.',
//                 }) as Record<string, JSX.Element>
//             ).component
//         );
//         expect(screen.getByText("You'll see these details once the contract starts.")).toBeInTheDocument();
//     });
//     it('should return an object with component that renders a message with blockchain details & Copy icon if desc has blockchain details, & action_type is deposit', () => {
//         render(
//             (
//                 getRowAction({
//                     ...depositTransactionData,
//                     desc: blockchainDesc,
//                 }) as Record<string, JSX.Element>
//             ).component
//         );
//         expect(screen.getByText(blockchainAddressText)).toBeInTheDocument();
//         expect(screen.getByText(blockchainTransactionText)).toBeInTheDocument();
//         expect(screen.getByText(copyIcon)).toBeInTheDocument();
//     });
//     it('should return an object with component that renders a message with blockchain details & 2 Copy icons if desc has blockchain details, action_type is withdrawal, & withdrawal_details are missing', () => {
//         render(
//             (
//                 getRowAction({
//                     ...withdrawalTransactionData,
//                     desc: blockchainDesc,
//                     withdrawal_details: '',
//                 }) as Record<string, JSX.Element>
//             ).component
//         );
//         expect(screen.getByText(blockchainAddressText)).toBeInTheDocument();
//         expect(screen.getByText(blockchainTransactionText)).toBeInTheDocument();
//         expect(screen.getAllByText(copyIcon)).toHaveLength(2);
//     });
// });

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
