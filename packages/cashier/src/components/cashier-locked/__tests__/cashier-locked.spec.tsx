import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierLocked from '../cashier-locked';
import { useAccountStatus, useCashierLocked, useDepositLocked, useWithdrawalLocked } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../cashier-providers';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useAccountStatus: jest.fn(),
    useCashierLocked: jest.fn(() => false),
    useDepositLocked: jest.fn(() => false),
    useWithdrawalLocked: jest.fn(),
}));

const mockUseAccountStatus = useAccountStatus as jest.MockedFunction<typeof useAccountStatus>;
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;
const mockUseDepositLocked = useDepositLocked as jest.MockedFunction<typeof useDepositLocked>;
const mockUseWithdrawalLocked = useWithdrawalLocked as jest.MockedFunction<typeof useWithdrawalLocked>;

describe('<CashierLocked />', () => {
    beforeEach(() => {
        mockUseDepositLocked.mockReturnValue(false);
        mockUseCashierLocked.mockReturnValue(false);
        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: false,
            isLoading: false,
            isSuccess: true,
        });
    });

    it('should show the proper message if there is a crypto cashier maintenance', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['system_maintenance'],
            },
            statuses: {
                status: [],
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'crypto',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                'Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if crypto withdrawal is suspended', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['system_maintenance'],
            },
            statuses: {
                status: [],
            },
        });

        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: true,
            isLoading: false,
            isSuccess: true,
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'crypto',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                'Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if crypto deposit is suspended', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['system_maintenance'],
            },
            statuses: {
                status: [],
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'crypto',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseDepositLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                'Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if there is a cashier maintenance', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['system_maintenance'],
            },
            statuses: {
                status: [],
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                'Our cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client does not provide residence', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['no_residence'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the documents are expired', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['documents_expired'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has cashier_locked_status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['cashier_locked_status'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });
        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
        );
    });

    it('should show the proper message if the client has disabled_status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['disabled_status'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            'Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.'
        );
    });

    it('should show the proper message if the client account has no currency', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_CURRENCY'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText('Please set your account currency to enable deposits and withdrawals.')
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client is not fully authenticated', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_AUTHENTICATE'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText(/Your account has not been authenticated./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client has ask_financial_risk_approval status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_FINANCIAL_RISK_APPROVAL'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                account_status: { cashier_validation: ['ASK_FINANCIAL_RISK_APPROVAL'] },
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByTestId('dt_financial_assessment_link')).toHaveAttribute(
            'href',
            '/account/financial-assessment'
        );
    });

    it('should show the proper message if the client is high risk and has no FA', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['FinancialAssessmentRequired'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText(/Your cashier is locked./i)).toBeInTheDocument();
        expect(screen.getByTestId('dt_financial_assessment_link')).toHaveAttribute(
            'href',
            '/account/financial-assessment'
        );
    });

    it('should show the proper message if the client has ask_tin_information', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_TIN_INFORMATION'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText(/You have not provided your tax identification number./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client has ask_uk_funds_protection', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_UK_FUNDS_PROTECTION'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                account_status: { cashier_validation: ['ASK_UK_FUNDS_PROTECTION'] },
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText(/Your cashier is locked./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client does not set 30-day turnover limit', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_SELF_EXCLUSION_MAX_TURNOVER_SET'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                /Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has missing required profile fields', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_FIX_DETAILS'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                account_status: { cashier_validation: ['ASK_FIX_DETAILS'] },
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable deposits and withdrawals./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has self-exluded from the website', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['SelfExclusion'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                accounts: { CR9000000: { excluded_until: Number(new Date()) } },
                current_currency_type: 'fiat',
                loginid: 'CR9000000',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseDepositLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            /If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat./i
        );
    });

    it('should show the proper message if the client has unwelcome_status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['unwelcome_status'],
            },
            statuses: {
                status: {
                    is_cashier_locked: true,
                },
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
        mockUseDepositLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent('Please contact us via live chat.');
    });

    it('should show the proper message if the client has no_withdrawal_or_trading_status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['no_withdrawal_or_trading_status'],
            },
            statuses: {
                status: {},
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: true,
            isLoading: false,
            isSuccess: true,
        });

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        );
    });

    it('should show the proper message if the client has withdrawal_locked_status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['withdrawal_locked_status'],
            },
            statuses: {
                status: {},
            },
        });

        const mock_root_store = mockStore({
            client: {
                account_status: { cashier_validation: ['withdrawal_locked_status'] },
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: true,
            isLoading: false,
            isSuccess: true,
        });

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        );
    });

    it('should show the proper message if the client has only_pa_withdrawals_allowed_status', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['only_pa_withdrawals_allowed_status'],
            },
            statuses: {
                status: {},
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: true,
            isLoading: false,
            isSuccess: true,
        });

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            'You can only make deposits. Please contact us via live chat for more information.'
        );
    });

    it('should prioritize cashier locked message if the client has a combo of deposit and cashier locked reasons', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['ASK_AUTHENTICATE', 'unwelcome_status'],
            },
            statuses: {
                status: {},
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: true,
            isLoading: false,
            isSuccess: true,
        });
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText(/Your account has not been authenticated./i)).toBeInTheDocument();
    });

    it('should show cashier locked message if the client has a combo of deposit and withdrawal locked reasons', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['no_withdrawal_or_trading_status', 'unwelcome_status'],
            },
            statuses: {
                status: {},
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        mockUseCashierLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(container).toHaveTextContent(
            'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
        );
    });

    it('should show the proper message if the client has PACommisionWithdrawalLimit', () => {
        mockUseAccountStatus.mockReturnValue({
            data: {
                cashier_validation: ['PACommisionWithdrawalLimit'],
            },
            statuses: {
                status: {},
            },
        });

        const mock_root_store = mockStore({
            client: {
                current_currency_type: 'fiat',
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });

        mockUseWithdrawalLocked.mockReturnValue({
            is_withdrawal_locked: true,
            isLoading: false,
            isSuccess: true,
        });

        render(<CashierLocked />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(
            screen.getByText(
                "It seems that you've no commissions to withdraw at the moment. You can make withdrawals once you receive your commissions."
            )
        ).toBeInTheDocument();
    });
});
