import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Analytics } from '@deriv-com/analytics';
import { MemoryRouter } from 'react-router-dom';
import { TCoreStores } from '@deriv/stores/types';
import { formatDate } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { mockStore } from '@deriv/stores';
import { useReportsStore } from 'Stores/useReportsStores';
import Statement, { getRowAction } from '../statement';
import ReportsProviders from '../../reports-providers';

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('Stores/useReportsStores', () => ({
    ...jest.requireActual('Stores/useReportsStores'),
    useReportsStore: jest.fn(() => ({
        statement: {
            action_type: 'all',
            data: [
                {
                    action: 'Sell',
                    action_type: 'sell',
                    amount: '11.00',
                    app_id: 2,
                    balance: '8,866.19',
                    date: '04 Jun 2024 01:47:16',
                    desc: "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 Index, multiplied by 50, minus commissions.",
                    display_name: '',
                    id: 243990619668,
                    payout: '0.00',
                    purchase_time: 1717078783,
                    refid: 487679411128,
                    shortcode: 'MULTUP_R_100_5.00_10_1717078783_4870713599_0_6.00_N1',
                    transaction_time: 1717465636,
                },
                {
                    action: 'Buy',
                    action_type: 'buy',
                    amount: '-10.00',
                    app_id: 36300,
                    balance: '8,845.35',
                    date: '31 May 2024 19:42:42',
                    desc: "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 100, minus commissions.",
                    display_name: '',
                    id: 244170956768,
                    payout: '0.00',
                    refid: 486932886768,
                    shortcode: 'MULTUP_1HZ100V_10.00_10_1717184563_4870799999_0_33.00_N1',
                    transaction_time: 1717184562,
                },
                {
                    action: 'Deposit',
                    amount: '1,000.00',
                    balance: '1,000.00',
                    refid: 17494117539,
                    transaction_time: 1685769338,
                },
            ],
            date_from: null,
            date_to: 1717631999,
            has_selected_date: true,
            handleScroll: jest.fn(),
            is_empty: false,
            is_loading: false,
            onMount: jest.fn(),
            onUnmount: jest.fn(),
        },
    })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
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
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Clipboard: jest.fn(() => <div>Copy icon</div>),
}));

describe('Statement', () => {
    let store = mockStore({});
    const allTransactions = 'All transactions';
    const buyTransactions = 'Buy';
    const dataTableTestId = 'dt_data_table';
    const dataListTestId = 'dt_data_list';
    const filterDropdown = 'dt_dropdown_display';
    const loadingTestId = 'dt_loading_component';
    const mockedErrorMessage = 'Error message';
    const noTransationsShortText = 'You have no transactions yet.';
    const noTransationsLongText = "You've made no transactions of this type during this period.";
    const props: React.ComponentProps<typeof Statement> = {
        component_icon: 'IcStatement',
    };

    const mockedStatement = (
        mockedStore: TCoreStores = store,
        mockedProps: React.ComponentProps<typeof Statement> = props
    ) => {
        return (
            <ReportsProviders store={mockedStore}>
                <MemoryRouter>
                    <Statement {...mockedProps} />
                </MemoryRouter>
            </ReportsProviders>
        );
    };

    beforeEach(() => {
        store = mockStore({
            client: {
                currency: 'USD',
                is_switching: false,
                is_virtual: true,
            },
        });
    });
    it('should render filter with All transactions selected and DataTable for desktop', () => {
        render(mockedStatement());
        expect(screen.getByTestId(filterDropdown)).toHaveTextContent(allTransactions);
        expect(screen.getByTestId(dataTableTestId)).toBeInTheDocument();
    });
    it('should render filter but no DataTable if data is empty on desktop', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
            },
        });
        render(mockedStatement());
        expect(screen.getByTestId(filterDropdown)).toHaveTextContent(allTransactions);
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
    });
    it('should render filter dropdown with All transactions selected and DataList for mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false, isMobile: true }));
        render(mockedStatement());
        expect(screen.getByRole('combobox')).toHaveValue('all');
        expect(screen.getByTestId(dataListTestId)).toBeInTheDocument();
    });
    it('should render filter dropdown but no DataList if data is empty on mobile', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
            },
        });
        render(mockedStatement());
        expect(screen.getByRole('combobox')).toHaveValue('all');
        expect(screen.queryByTestId(dataListTestId)).not.toBeInTheDocument();
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: true, isMobile: false }));
    });
    it('should render error if it is defined', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                error: mockedErrorMessage,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByText(mockedErrorMessage)).toBeInTheDocument();
    });
    it('should render a long No transactions message when data is empty & is_empty === true & has_selected_date === true', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
                is_empty: true,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByText(noTransationsLongText)).toBeInTheDocument();
    });
    it('should render a short No transactions message when data is empty & is_empty === true & has_selected_date === false', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
                is_empty: true,
                has_selected_date: false,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByText(noTransationsShortText)).toBeInTheDocument();
    });
    it('should render Loading when data is empty & is_loading === true', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                data: [],
                is_loading: true,
            },
        });
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
    it('should render Loading when is_switching === true', () => {
        store.client.is_switching = true;
        render(mockedStatement());
        expect(screen.queryByTestId(dataTableTestId)).not.toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
    it('should render DataTable together with Loading when data is available & is_loading === true', () => {
        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                is_loading: true,
            },
        });
        render(mockedStatement());
        expect(screen.getByTestId(dataTableTestId)).toBeInTheDocument();
        expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
    it('should set Buy filter when it is selected from the dropdown', () => {
        render(mockedStatement());
        userEvent.click(within(screen.getByTestId(filterDropdown)).getByText(allTransactions));
        userEvent.click(screen.getByText(buyTransactions));
        expect(screen.getByTestId(filterDropdown)).toHaveTextContent(buyTransactions);
    });
    it('should send analytics when previous filter value is defined', () => {
        const { rerender } = render(mockedStatement());

        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                action_type: 'buy',
            },
        });
        rerender(mockedStatement());
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            'ce_reports_form',
            expect.objectContaining({
                action: 'filter_transaction_type',
                form_name: 'default',
                subform_name: 'statement_form',
                transaction_type_filter: 'buy',
            })
        );
    });
    it('should send analytics when previous date_from and date_to are defined', () => {
        const { rerender } = render(mockedStatement());

        (useReportsStore as jest.Mock).mockReturnValueOnce({
            statement: {
                ...useReportsStore().statement,
                date_from: 1717184362,
                date_to: 1717631989,
            },
        });
        rerender(mockedStatement());
        expect(Analytics.trackEvent).toHaveBeenCalledWith(
            'ce_reports_form',
            expect.objectContaining({
                action: 'filter_dates',
                form_name: 'default',
                subform_name: 'statement_form',
                start_date_filter: formatDate(1717184362, 'DD/MM/YYYY', false),
                end_date_filter: formatDate(1717631989, 'DD/MM/YYYY', false),
            })
        );
    });
});

describe('getRowAction', () => {
    const copyIcon = 'Copy icon';
    const blockchainAddress = 'tb1qhu8ksh4ylvzycycm9e0eh3wy6fcxfp7g272qgi';
    const blockchainTransaction = '3afb4aea5c6c250779ab2069f7bfaae87c64c3f64a116c251806b8e650513d27';
    const blockchainDesc = `address: ${blockchainAddress}, transaction: ${blockchainTransaction}`;
    const blockchainAddressText = `Address: ${blockchainAddress},`;
    const blockchainTransactionText = `Transaction: ${blockchainTransaction}`;
    const contractDetailsUnavailableText = /contract details aren't currently available/i;
    const longcodeDescription =
        'Win payout if Volatility 100 (1s) Index after 5 ticks is strictly higher than entry spot.';
    const unsupportedContractShortcode = 'CALLSPREAD_1HZ100V_66.87_1717660032_5T';

    const riseContractData = {
        balance: '0.00',
        desc: longcodeDescription,
        display_name: '',
        id: 244821136548,
        payout: '66.87',
        shortcode: 'CALL_1HZ100V_66.87_1717660032_5T_S0P_0',
    };
    const buyTransactionData = {
        ...riseContractData,
        action: 'Buy',
        action_type: 'buy',
        amount: '-34.23',
        app_id: 36300,
        date: '06 Jun 2024 07:47:12',
        refid: 488153867768,
        transaction_time: 1717660032,
    };
    const sellTransactionData = {
        ...riseContractData,
        action: 'Sell',
        action_type: 'sell',
        amount: '0.00',
        app_id: 2,
        date: '06 Jun 2024 07:47:18',
        purchase_time: 1717660032,
        refid: 488153881108,
        transaction_time: 1717660038,
    };
    const depositTransactionData = {
        action: 'Deposit',
        action_type: 'deposit',
        amount: '10,000.00',
        app_id: 36300,
        balance: '10,000.00',
        date: '06 Jun 2024 07:47:27',
        desc: 'Reset to default demo account balance.',
        display_name: '',
        id: null,
        payout: '-',
        refid: 488153902708,
        shortcode: null,
        transaction_time: 1717660047,
    };
    const withdrawalTransactionData = {
        action: 'Withdrawal',
        action_type: 'withdrawal',
        amount: '750.00',
        app_id: 36300,
        balance: '0.00',
        date: '06 Jun 2024 08:47:27',
        desc: 'Withdrawal message',
        longcode: 'Withdrawal message',
        refid: 243990619558,
        transaction_time: 1717465636,
        withdrawal_details: 'Withdrawal details',
    };

    it('should return an empty object if received data is an empty object, or if action_type is missing', () => {
        expect(getRowAction({})).toMatchObject({});

        expect(getRowAction({ ...buyTransactionData, action_type: '' })).toMatchObject({});
    });
    it('should return contract path string if row_obj has id, action_type is buy or sell, and contract is supported & not forward-starting', () => {
        expect(getRowAction(buyTransactionData)).toEqual(`/contract/${buyTransactionData.id}`);

        expect(getRowAction(sellTransactionData)).toEqual(`/contract/${sellTransactionData.id}`);
    });
    it('should return an object with component that renders desc if action_type is valid but not buy or sell', () => {
        render((getRowAction(depositTransactionData) as Record<string, JSX.Element>).component);
        expect(screen.getByText(depositTransactionData.desc)).toBeInTheDocument();
    });
    it('should return an object with component that renders withdrawal_details and longcode if action_type is withdrawal, & data includes withdrawal_details and longcode', () => {
        render((getRowAction(withdrawalTransactionData) as Record<string, JSX.Element>).component);
        expect(
            screen.getByText(`${withdrawalTransactionData.withdrawal_details} ${withdrawalTransactionData.longcode}`)
        ).toBeInTheDocument();
    });
    it('should return an object with component that renders desc if action_type is withdrawal, & withdrawal_details are missing', () => {
        render(
            (getRowAction({ ...withdrawalTransactionData, withdrawal_details: '' }) as Record<string, JSX.Element>)
                .component
        );
        expect(screen.getByText(withdrawalTransactionData.desc)).toBeInTheDocument();
    });
    it('should return an object with component that renders a correct message if action_type is buy or sell, & shortcode contains an unsupported contract_type', () => {
        const { rerender } = render(
            (
                getRowAction({
                    ...sellTransactionData,
                    shortcode: unsupportedContractShortcode,
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText(contractDetailsUnavailableText)).toBeInTheDocument();

        rerender(
            (
                getRowAction({
                    ...buyTransactionData,
                    shortcode: unsupportedContractShortcode,
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText(contractDetailsUnavailableText)).toBeInTheDocument();
    });
    it('should return an object with component that renders a correct message if action_type is buy, & shortcode contains forward-starting contract details', () => {
        render(
            (
                getRowAction({
                    ...buyTransactionData,
                    transaction_time: 1717662763,
                    shortcode: `CALL_1HZ25V_19.54_${Math.floor(Date.now() / 1000) + 100}F_1717762800_S0P_0`,
                    desc: 'Win payout if Volatility 25 (1s) Index is strictly higher than entry spot at 15 minutes after 2024-06-07 12:05:00 GMT.',
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText("You'll see these details once the contract starts.")).toBeInTheDocument();
    });
    it('should return an object with component that renders a message with blockchain details & Copy icon if desc has blockchain details, & action_type is deposit', () => {
        render(
            (
                getRowAction({
                    ...depositTransactionData,
                    desc: blockchainDesc,
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText(blockchainAddressText)).toBeInTheDocument();
        expect(screen.getByText(blockchainTransactionText)).toBeInTheDocument();
        expect(screen.getByText(copyIcon)).toBeInTheDocument();
    });
    it('should return an object with component that renders a message with blockchain details & 2 Copy icons if desc has blockchain details, action_type is withdrawal, & withdrawal_details are missing', () => {
        render(
            (
                getRowAction({
                    ...withdrawalTransactionData,
                    desc: blockchainDesc,
                    withdrawal_details: '',
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText(blockchainAddressText)).toBeInTheDocument();
        expect(screen.getByText(blockchainTransactionText)).toBeInTheDocument();
        expect(screen.getAllByText(copyIcon)).toHaveLength(2);
    });
});
