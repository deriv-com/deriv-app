import React from 'react';
import { render, screen } from '@testing-library/react';
import CashierLocked from '../cashier-locked';

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CashierLocked />', () => {
    it('should show the proper message if there is a cryptocashier maintenance', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: [],
                }}
                current_currency_type={'crypto'}
                is_deposit_locked={false}
                is_system_maintenance
                is_withdrawal_locked={false}
            />
        );

        expect(
            screen.getByText(
                'Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if crypto withdrawal is suspended', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: [],
                }}
                current_currency_type={'crypto'}
                is_deposit_locked={false}
                is_system_maintenance
                is_withdrawal_locked
            />
        );

        expect(
            screen.getByText(
                'Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if crypto deposit is suspended', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: [],
                }}
                current_currency_type={'crypto'}
                is_deposit_locked
                is_system_maintenance
                is_withdrawal_locked={false}
            />
        );

        expect(
            screen.getByText(
                'Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if there is a cashier maintenance', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: [],
                }}
                current_currency_type={'fiat'}
                is_deposit_locked={false}
                is_system_maintenance
                is_withdrawal_locked={false}
            />
        );

        expect(
            screen.getByText(
                'Our cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client does not provide residence', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['no_residence'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                'You’ve not set your country of residence. To access Cashier, please update your country of residence in the Personal details section in your account settings.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the documents are expired', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['documents_expired'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                'The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has cashier_locked_status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['cashier_locked_status'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has disabled_status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['disabled_status'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                'Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client account has no currency', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_CURRENCY'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText('Please set your account currency to enable deposits and withdrawals.')
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client is not fully authenticated', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_AUTHENTICATE'],
                }}
                is_cashier_locked
            />
        );

        expect(screen.getByText(/Your account has not been authenticated./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client has ask_financial_risk_approval status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_FINANCIAL_RISK_APPROVAL'],
                }}
                is_cashier_locked
            />
        );

        expect(screen.getByTestId('dt_financial_assessment_link')).toHaveAttribute(
            'href',
            '/account/financial-assessment'
        );
    });

    it('should show the proper message if the client is high risk and has no FA', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['FinancialAssessmentRequired'],
                }}
                is_cashier_locked
            />
        );

        expect(screen.getByText(/Your cashier is locked./i)).toBeInTheDocument();
        expect(screen.getByTestId('dt_financial_assessment_link')).toHaveAttribute(
            'href',
            '/account/financial-assessment'
        );
    });

    it('should show the proper message if the client has ask_tin_information', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_TIN_INFORMATION'],
                }}
                is_cashier_locked
            />
        );

        expect(screen.getByText(/You have not provided your tax identification number./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client has ask_uk_funds_protection', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_UK_FUNDS_PROTECTION'],
                }}
                is_cashier_locked
            />
        );

        expect(screen.getByText(/Your cashier is locked./i)).toBeInTheDocument();
    });

    it('should show the proper message if the client does not set 30-day turnover limit', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_SELF_EXCLUSION_MAX_TURNOVER_SET'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                /Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has missing required profile fields', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_FIX_DETAILS'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable deposits and withdrawals./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has self-exluded from the website', () => {
        render(
            <CashierLocked
                accounts={{
                    CR9000000: {
                        excluded_until: new Date(),
                    },
                }}
                account_status={{
                    cashier_validation: ['SelfExclusion'],
                }}
                is_cashier_locked={false}
                is_deposit_locked
                loginid={'CR9000000'}
            />
        );

        expect(
            screen.getByText(
                /If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat./i
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has unwelcome_status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['unwelcome_status'],
                }}
                is_cashier_locked={false}
                is_deposit_locked
            />
        );

        expect(screen.getByText('Please contact us via live chat.')).toBeInTheDocument();
    });

    it('should show the proper message if the client has no_withdrawal_or_trading_status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['no_withdrawal_or_trading_status'],
                }}
                is_cashier_locked={false}
                is_withdrawal_locked
            />
        );

        expect(
            screen.getByText(
                'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has withdrawal_locked_status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['withdrawal_locked_status'],
                }}
                is_cashier_locked={false}
                is_withdrawal_locked
            />
        );

        expect(
            screen.getByText(
                'Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has only_pa_withdrawals_allowed_status', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['only_pa_withdrawals_allowed_status'],
                }}
                is_cashier_locked={false}
                is_withdrawal_locked
            />
        );

        expect(
            screen.getByText('You can only make deposits. Please contact us via live chat for more information.')
        ).toBeInTheDocument();
    });

    it('should prioritize cashier locked message if the client has a combo of deposit and cashier locked reasons', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['ASK_AUTHENTICATE', 'unwelcome_status'],
                }}
                is_cashier_locked
            />
        );

        expect(screen.getByText(/Your account has not been authenticated./i)).toBeInTheDocument();
    });

    it('should show cashier locked message if the client has a combo of deposit and withdrawal locked reasons', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['no_withdrawal_or_trading_status', 'unwelcome_status'],
                }}
                is_cashier_locked
            />
        );

        expect(
            screen.getByText(
                'Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'
            )
        ).toBeInTheDocument();
    });

    it('should show the proper message if the client has PACommisionWithdrawalLimit', () => {
        render(
            <CashierLocked
                account_status={{
                    cashier_validation: ['PACommisionWithdrawalLimit'],
                }}
                is_withdrawal_locked
            />
        );

        expect(
            screen.getByText(
                "It seems that you've no commissions to withdraw at the moment. You can make withdrawals once you receive your commissions."
            )
        ).toBeInTheDocument();
    });
});
