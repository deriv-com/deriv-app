import React from 'react';
import { render, screen } from '@testing-library/react';
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
    // const loadingTestId = 'dt_loading_component';
    const mocked_error_message = 'Error message';
    const no_open_positions_text = 'You have no open positions yet.';
    const accumulators_position = {
        contract_info: {
            account_id: 112905368,
            barrier_count: 2,
            barrier_spot_distance: '0.726',
            bid_price: 10.62,
            buy_price: 10,
            contract_id: 246179907888,
            contract_type: 'ACCU',
            currency: 'USD',
            current_spot: 1184.9,
            current_spot_display_value: '1184.90',
            current_spot_high_barrier: '1185.626',
            current_spot_low_barrier: '1184.174',
            current_spot_time: 1718631006,
            date_expiry: 1750204799,
            date_settlement: 1750204800,
            date_start: 1718630993,
            display_name: 'Volatility 100 Index',
            entry_spot: 1184.67,
            entry_spot_display_value: '1184.67',
            entry_tick: 1184.67,
            entry_tick_display_value: '1184.67',
            entry_tick_time: 1718630994,
            expiry_time: 1750204799,
            growth_rate: 0.01,
            high_barrier: '1185.156',
            id: '6838091b-05ce-7872-3131-eedddd394422',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 0,
            is_path_dependent: 1,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 0,
            is_valid_to_sell: 1,
            longcode:
                'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06126% from the previous spot price.',
            low_barrier: '1183.704',
            profit: 0.62,
            profit_percentage: 6.2,
            purchase_time: 1718630993,
            shortcode: 'ACCU_R_100_10.00_0_0.01_1_0.000612552024_1718630993',
            status: 'open',
            tick_count: 230,
            tick_passed: 6,
            tick_stream: [
                {
                    epoch: 1718630994,
                    tick: 1184.67,
                    tick_display_value: '1184.67',
                },
                {
                    epoch: 1718630996,
                    tick: 1184.86,
                    tick_display_value: '1184.86',
                },
                {
                    epoch: 1718630998,
                    tick: 1184.65,
                    tick_display_value: '1184.65',
                },
                {
                    epoch: 1718631000,
                    tick: 1184.68,
                    tick_display_value: '1184.68',
                },
                {
                    epoch: 1718631002,
                    tick: 1184.59,
                    tick_display_value: '1184.59',
                },
                {
                    epoch: 1718631004,
                    tick: 1184.43,
                    tick_display_value: '1184.43',
                },
                {
                    epoch: 1718631006,
                    tick: 1184.9,
                    tick_display_value: '1184.90',
                },
            ],
            transaction_ids: {
                buy: 490754417148,
            },
            underlying: 'R_100',
        },
        details:
            'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.06126% from the previous spot price.',
        display_name: '',
        id: 246179907888,
        indicative: 10.62,
        purchase: 10,
        reference: 490754417148,
        type: 'ACCU',
        profit_loss: 0.62,
        is_valid_to_sell: true,
        current_tick: 6,
        status: 'profit',
        entry_spot: 1184.67,
        high_barrier: 1185.156,
        low_barrier: 1183.704,
    } as TPortfolioPosition;
    const multipliers_position = {
        contract_info: {
            account_id: 112905368,
            barrier_count: 1,
            bid_price: 9.74,
            buy_price: 10,
            commission: 0.11,
            contract_id: 246179821988,
            contract_type: 'MULTUP',
            currency: 'USD',
            current_spot: 1186.1,
            current_spot_display_value: '1186.10',
            current_spot_time: 1718630966,
            date_expiry: 4872268799,
            date_settlement: 4872268800,
            date_start: 1718630940,
            display_name: 'Volatility 100 Index',
            entry_spot: 1186.71,
            entry_spot_display_value: '1186.71',
            entry_tick: 1186.71,
            entry_tick_display_value: '1186.71',
            entry_tick_time: 1718630942,
            expiry_time: 4872268799,
            id: '6838091b-05ce-7872-3131-eedddd394422',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 0,
            is_path_dependent: 1,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 0,
            is_valid_to_sell: 1,
            limit_order: {
                stop_out: {
                    display_name: 'Stop out',
                    order_amount: -10,
                    order_date: 1718630940,
                    value: '1147.58',
                },
            },
            longcode:
                "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 300, minus commissions.",
            multiplier: 30,
            profit: -0.26,
            profit_percentage: -2.6,
            purchase_time: 1718630940,
            shortcode: 'MULTUP_R_100_10.00_30_1718630940_4872268799_0_0.00_N1',
            status: 'open',
            transaction_ids: {
                buy: 490754245448,
            },
            underlying: 'R_100',
        },
        details:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 300, minus commissions.",
        display_name: '',
        id: 246179821988,
        indicative: 9.74,
        purchase: 10,
        reference: 490754245448,
        type: 'MULTUP',
        contract_update: {
            stop_out: {
                display_name: 'Stop out',
                order_amount: -10,
                order_date: 1718630940,
                value: '1147.58',
            },
        },
        entry_spot: 1186.71,
        profit_loss: -0.26,
        is_valid_to_sell: true,
        status: 'loss',
    } as TPortfolioPosition;
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
            date_expiry: 1718652164,
            date_settlement: 1718652164,
            date_start: 1718630564,
            display_name: 'Volatility 100 Index',
            entry_spot: 1184.99,
            entry_spot_display_value: '1184.99',
            entry_tick: 1184.99,
            entry_tick_display_value: '1184.99',
            entry_tick_time: 1718630566,
            expiry_time: 1718652164,
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
            shortcode: 'CALL_R_100_19.73_1718630564_1718652164_S0P_0',
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
    it('should render NotificationMessages and No positions message but no filter and no DataTable if data is empty on desktop', () => {
        store.portfolio.active_positions = [];
        render(mockedOpenPositions());

        expect(screen.getByText('NotificationMessages')).toBeInTheDocument();
        expect(screen.queryByTestId(filter_dropdown)).not.toBeInTheDocument();
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByText(no_open_positions_text)).toBeInTheDocument();
    });
    it('should render NotificationMessages and No positions message but no filter and no Datalist if data is empty on mobile', () => {
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
        expect(screen.queryByText(Math.abs(multipliers_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });
    it('should render filter dropdown with Multipliers selected if is_multiplier is true in portfolio-store', () => {
        store.portfolio.is_multiplier = true;
        render(mockedOpenPositions());

        expect(screen.getByTestId(filter_dropdown)).toHaveTextContent('Multipliers');
        expect(screen.queryByText(Math.abs(options_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.getByText(Math.abs(multipliers_position.profit_loss))).toBeInTheDocument();
        expect(screen.queryByText(Math.abs(accumulators_position.profit_loss))).not.toBeInTheDocument();
    });
    it('should render filter dropdown with Accumulators selected if is_accumulator is true in portfolio-store', () => {
        store.portfolio.is_accumulator = true;
        render(mockedOpenPositions());

        expect(screen.getAllByTestId(filter_dropdown)).toHaveLength(2);
        expect(screen.getAllByTestId(filter_dropdown)[0]).toHaveTextContent('Accumulators');
        expect(screen.getAllByTestId(filter_dropdown)[1]).toHaveTextContent('All growth rates');
        expect(screen.queryByText(Math.abs(options_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.queryByText(Math.abs(multipliers_position.profit_loss))).not.toBeInTheDocument();
        expect(screen.getByText(Math.abs(accumulators_position.profit_loss))).toBeInTheDocument();
    });
    it('should render error if it is defined', () => {
        store.portfolio.error = mocked_error_message;
        render(mockedOpenPositions());

        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.getByText(mocked_error_message)).toBeInTheDocument();
    });
    // it('should render a long No transactions message when data is empty & is_empty === true & has_selected_date === true', () => {
    //     (useReportsStore as jest.Mock).mockReturnValueOnce({
    //         statement: {
    //             ...useReportsStore().statement,
    //             data: [],
    //             is_empty: true,
    //         },
    //     });
    //     render(mockedStatement());
    //     expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
    //     expect(screen.getByText(noTransationsLongText)).toBeInTheDocument();
    // });
    // it('should render a short No transactions message when data is empty & is_empty === true & has_selected_date === false', () => {
    //     (useReportsStore as jest.Mock).mockReturnValueOnce({
    //         statement: {
    //             ...useReportsStore().statement,
    //             data: [],
    //             is_empty: true,
    //             has_selected_date: false,
    //         },
    //     });
    //     render(mockedStatement());
    //     expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
    //     expect(screen.getByText(noTransationsShortText)).toBeInTheDocument();
    // });
    // it('should render Loading when data is empty & is_loading === true', () => {
    //     (useReportsStore as jest.Mock).mockReturnValueOnce({
    //         statement: {
    //             ...useReportsStore().statement,
    //             data: [],
    //             is_loading: true,
    //         },
    //     });
    //     render(mockedStatement());
    //     expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
    //     expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    // });
    // it('should render Loading when is_switching === true', () => {
    //     store.client.is_switching = true;
    //     render(mockedStatement());
    //     expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
    //     expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    // });
    // it('should render DataTable together with Loading when data is available & is_loading === true', () => {
    //     (useReportsStore as jest.Mock).mockReturnValueOnce({
    //         statement: {
    //             ...useReportsStore().statement,
    //             is_loading: true,
    //         },
    //     });
    //     render(mockedStatement());
    //     expect(screen.getByTestId(dataTableTestId)).toBeInTheDocument();
    //     expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    // });
    // it('should set Buy filter when it is selected from the dropdown', () => {
    //     render(mockedStatement());
    //     userEvent.click(within(screen.getByTestId(filterDropdown)).getByText(allTransactions));
    //     userEvent.click(screen.getByText(buyTransactions));
    //     expect(screen.getByTestId(filterDropdown)).toHaveTextContent(buyTransactions);
    // });
    // it('should send analytics when previous filter value is defined', () => {
    //     const { rerender } = render(mockedStatement());

    //     (useReportsStore as jest.Mock).mockReturnValueOnce({
    //         statement: {
    //             ...useReportsStore().statement,
    //             action_type: 'buy',
    //         },
    //     });
    //     rerender(mockedStatement());
    //     expect(Analytics.trackEvent).toHaveBeenCalledWith(
    //         'ce_reports_form',
    //         expect.objectContaining({
    //             action: 'filter_transaction_type',
    //             form_name: 'default',
    //             subform_name: 'statement_form',
    //             transaction_type_filter: 'buy',
    //         })
    //     );
    // });
    // it('should send analytics when previous date_from and date_to are defined', () => {
    //     const { rerender } = render(mockedStatement());

    //     (useReportsStore as jest.Mock).mockReturnValueOnce({
    //         statement: {
    //             ...useReportsStore().statement,
    //             date_from: 1717184362,
    //             date_to: 1717631989,
    //         },
    //     });
    //     rerender(mockedStatement());
    //     expect(Analytics.trackEvent).toHaveBeenCalledWith(
    //         'ce_reports_form',
    //         expect.objectContaining({
    //             action: 'filter_dates',
    //             form_name: 'default',
    //             subform_name: 'statement_form',
    //             start_date_filter: formatDate(1717184362, 'DD/MM/YYYY', false),
    //             end_date_filter: formatDate(1717631989, 'DD/MM/YYYY', false),
    //         })
    //     );
    // });
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
