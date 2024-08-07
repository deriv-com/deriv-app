import React from 'react';
import { Router } from 'react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBrowserHistory } from 'history';
import { useCashierLocked, useDepositLocked, useMFAccountStatus } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import CashierLocked from '../cashier-locked';
import CashierProviders from '../../../cashier-providers';
import { TCoreStores } from '@deriv/stores/types';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositLocked: jest.fn(() => false),
    useCashierLocked: jest.fn(() => false),
    useMFAccountStatus: jest.fn(),
}));

const mockUseDepositLocked = useDepositLocked as jest.MockedFunction<typeof useDepositLocked>;
const mockUseCashierLocked = useCashierLocked as jest.MockedFunction<typeof useCashierLocked>;

describe('<CashierLocked />', () => {
    const history = createBrowserHistory();
    const wrapWithRouter = (component: React.ReactElement) => {
        return <Router history={history}>{component}</Router>;
    };

    let mock_store: TCoreStores;
    beforeEach(() => {
        mockUseDepositLocked.mockReturnValue(false);
        mockUseCashierLocked.mockReturnValue(false);
        (useMFAccountStatus as jest.Mock).mockReturnValue(null);
        mock_store = mockStore({
            client: {
                mt5_login_list: [
                    {
                        account_type: 'demo',
                        sub_account_type: 'financial_stp',
                    },
                ],
            },
        });
    });

    it('should show the proper message if there is a crypto cashier maintenance', () => {
        mock_store.client.account_status.cashier_validation = ['system_maintenance'];
        mock_store.client.current_currency_type = 'crypto';

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByText('Cashier is currently down for maintenance')).toBeInTheDocument();
        expect(screen.getByText(/Please check back in a few minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/Thank you for your patience./i)).toBeInTheDocument();
    });

    it('should show the proper message if crypto withdrawal is suspended', () => {
        mock_store.client.account_status.cashier_validation = ['system_maintenance'];
        mock_store.client.current_currency_type = 'crypto';
        mock_store.client.is_withdrawal_lock = true;

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if crypto deposit is suspended', () => {
        mock_store.client.account_status.cashier_validation = ['system_maintenance'];
        mock_store.client.current_currency_type = 'crypto';
        mockUseDepositLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if there is a cashier maintenance', () => {
        mock_store.client.account_status.cashier_validation = ['system_maintenance'];
        mock_store.client.current_currency_type = 'fiat';

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByText('Cashier is currently down for maintenance')).toBeInTheDocument();
    });

    it('should show the proper message if the client does not provide residence', () => {
        mock_store.client.account_status.cashier_validation = ['no_residence'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the documents are expired', () => {
        mock_store.client.account_status.cashier_validation = ['documents_expired'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has cashier_locked_status', () => {
        mock_store.client.account_status.cashier_validation = ['cashier_locked_status'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
        );
    });

    it('should show the proper message if the client has disabled_status', () => {
        mock_store.client.account_status.cashier_validation = ['disabled_status'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            'Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.'
        );
    });

    it('should show the proper message if the client account has no currency', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_CURRENCY'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText('Please set your account currency to enable deposits and withdrawals.')
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client is not fully authenticated', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_AUTHENTICATE'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByText(/Your account has not been authenticated./i)).toBeInTheDocument();
    });

    it('should show the proper message if eu client is not fully authenticated and landed in deposit page', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_AUTHENTICATE'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/deposit');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText('You can make a new deposit once the verification of your account is complete.')
        ).toBeInTheDocument();
    });

    it('should show the proper message if eu client is not fully authenticated and landed in withdrawal page', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_AUTHENTICATE'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/withdrawal');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText('You can make a withdrawal once the verification of your account is complete.')
        ).toBeInTheDocument();
    });

    it('should show the proper message if eu client is not fully authenticated and landed in transfers page', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_AUTHENTICATE'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/account-transfer');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText('You can make a funds transfer once the verification of your account is complete.')
        ).toBeInTheDocument();
    });

    it('should redirect eu client that is not fully authenticated to POI page when `Verify now` button is clicked', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_AUTHENTICATE'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/account-transfer');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        const verify_button = screen.getByRole('button', { name: 'Verify now' });
        expect(verify_button).toBeInTheDocument();
        userEvent.click(verify_button);

        expect(history.location.pathname).toBe('/account/proof-of-identity');
    });

    it('should show the proper message if eu client`s verification is pending and landed in deposit page', () => {
        (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.PENDING);
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/deposit');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'You cannot make further deposits as your documents are still under review. We will notify you by email within 3 days once your verification is approved.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if eu client`s verification is pending and landed in withdrawal page', () => {
        (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.PENDING);
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/withdrawal');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'You cannot make a withdrawal as your documents are still under review. We will notify you by email within 3 days once your verification is approved.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if eu client`s verification is pending and landed in transfer page', () => {
        (useMFAccountStatus as jest.Mock).mockReturnValue(MT5_ACCOUNT_STATUS.PENDING);
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_eu = true;
        mockUseCashierLocked.mockReturnValue(true);
        history.push('/cashier/account-transfer');

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                'You cannot make a fund transfer as your documents are still under review. We will notify you by email within 3 days once your verification is approved.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has ask_financial_risk_approval status', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_FINANCIAL_RISK_APPROVAL'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByTestId('dt_financial_assessment_link')).toHaveAttribute(
            'href',
            '/account/financial-assessment'
        );
    });

    it('should show the proper message if the client is high risk and has no FA', () => {
        mock_store.client.account_status.cashier_validation = ['FinancialAssessmentRequired'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByText(/Your cashier is locked./i)).toBeInTheDocument();
        expect(screen.getByTestId('dt_financial_assessment_link')).toHaveAttribute(
            'href',
            '/account/financial-assessment'
        );
    });

    it('should show the proper message if the client has ask_tin_information', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_TIN_INFORMATION'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByText(/You have not provided your tax identification number./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client does not set 30-day turnover limit', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_SELF_EXCLUSION_MAX_TURNOVER_SET'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                /Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has missing required profile fields', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_FIX_DETAILS'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable deposits and withdrawals./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has self-exluded from the website', () => {
        mock_store.client.account_status.cashier_validation = ['SelfExclusion'];
        mock_store.client.accounts.CR9000000 = {
            excluded_until: Number(new Date()),
            landing_company_shortcode: 'maltainvest',
            is_virtual: 0,
        };
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.loginid = 'CR9000000';
        mockUseDepositLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            /If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat./i
        );
    });

    it('should show the proper message if the client has unwelcome_status', () => {
        mock_store.client.account_status.cashier_validation = ['unwelcome_status'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseDepositLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent('Please contact us via live chat.');
    });

    it('should show the proper message if the client has no_withdrawal_or_trading_status', () => {
        mock_store.client.account_status.cashier_validation = ['no_withdrawal_or_trading_status'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_withdrawal_lock = true;

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        );
    });

    it('should show the proper message if the client has withdrawal_locked_status', () => {
        mock_store.client.account_status.cashier_validation = ['withdrawal_locked_status'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_withdrawal_lock = true;

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
        );
    });

    it('should show the proper message if the client has only_pa_withdrawals_allowed_status', () => {
        mock_store.client.account_status.cashier_validation = ['only_pa_withdrawals_allowed_status'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_withdrawal_lock = true;

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            'You can only make deposits. Please contact us via live chat for more information.'
        );
    });

    it('should prioritize cashier locked message if the client has a combo of deposit and cashier locked reasons', () => {
        mock_store.client.account_status.cashier_validation = ['ASK_AUTHENTICATE', 'unwelcome_status'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(screen.getByText(/Your account has not been authenticated./i)).toBeInTheDocument();
    });

    it('should show cashier locked message if the client has a combo of deposit and withdrawal locked reasons', () => {
        mock_store.client.account_status.cashier_validation = ['no_withdrawal_or_trading_status', 'unwelcome_status'];
        mock_store.client.current_currency_type = 'fiat';
        mockUseCashierLocked.mockReturnValue(true);

        const { container } = render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(container).toHaveTextContent(
            'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
        );
    });

    it('should show the proper message if the client has PACommisionWithdrawalLimit', () => {
        mock_store.client.account_status.cashier_validation = ['PACommisionWithdrawalLimit'];
        mock_store.client.current_currency_type = 'fiat';
        mock_store.client.is_withdrawal_lock = true;

        render(<CashierLocked />, {
            wrapper: ({ children }) =>
                wrapWithRouter(<CashierProviders store={mock_store}>{children}</CashierProviders>),
        });

        expect(
            screen.getByText(
                "It seems that you've no commissions to withdraw at the moment. You can make withdrawals once you receive your commissions."
            )
        ).toBeInTheDocument();
    });
});
