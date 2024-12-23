import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getCashierLockedDesc, { getSystemMaintenanceContent } from '../CashierLockedContent';

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('CashierLockedContent', () => {
    it('renders title and description as null when not system maintenance', () => {
        const result = getSystemMaintenanceContent({});

        expect(result).toBeFalsy();
    });

    it('renders description as null when cashier is not locked', () => {
        const result = getCashierLockedDesc({});

        expect(result).toBeFalsy();
    });

    it('renders correct message when system maintenance and cashier is locked', () => {
        const result = getSystemMaintenanceContent({
            currency: 'USD',
            isCashierLocked: true,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits and withdrawals with your USD Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(
            screen.getByText('USD Wallet deposits and withdrawals are temporarily unavailable.')
        ).toBeInTheDocument();
    });

    it('renders correct message when system maintenance and deposit is locked for crypto account', () => {
        const result = getSystemMaintenanceContent({
            currency: 'BTC',
            isCrypto: true,
            isDepositLocked: true,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(screen.getByText('BTC Wallet deposits are temporarily unavailable.')).toBeInTheDocument();
    });

    it('renders correct message when system maintenance and withdrawal is locked for crypto account', () => {
        const result = getSystemMaintenanceContent({
            currency: 'BTC',
            isCrypto: true,
            isWithdrawalLocked: true,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(screen.getByText('BTC Wallet withdrawals are temporarily unavailable.')).toBeInTheDocument();
    });

    it('renders correct message when noResidence status received', () => {
        const result = getCashierLockedDesc({
            currency: 'USD',
            noResidence: true,
        });

        if (result) render(result);
        expect(screen.getByText(/You've not set your country of residence/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Personal details section' })).toBeInTheDocument();
    });

    it('renders correct message when documentsExpired status received', () => {
        const result = getCashierLockedDesc({
            currency: 'USD',
            documentsExpired: true,
        });

        if (result) render(result);
        expect(screen.getByText(/The identification documents you submitted have expired/)).toBeInTheDocument();
        expect(
            screen.getByText(/Please submit valid identity documents to unlock your USD Wallet/)
        ).toBeInTheDocument();
    });

    it('renders correct message when cashierLockedStatus status received', () => {
        const result = getCashierLockedDesc({
            cashierLockedStatus: true,
            currency: 'USD',
        });

        if (result) render(result);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        userEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('renders correct message when disabledStatus status received', () => {
        const result = getCashierLockedDesc({
            currency: 'USD',
            disabledStatus: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        userEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('renders correct message when askCurrency status received', () => {
        const result = getCashierLockedDesc({
            askCurrency: true,
            currency: 'USD',
        });

        if (result) render(result);
        expect(
            screen.getByText(/Please set your account currency to enable deposits and withdrawals/)
        ).toBeInTheDocument();
    });

    it('renders correct message when askAuthenticate status received for MF transfer module', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            currency: 'EUR',
            isEuRegion: true,
            module: 'transfer',
        });

        if (result) render(result);
        expect(
            screen.getByText('You can make a funds transfer once the verification of your account is complete.')
        ).toBeInTheDocument();
    });

    it('renders correct message when askAuthenticate status received for MF withdrawal module', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            currency: 'EUR',
            isEuRegion: true,
            module: 'withdrawal',
        });

        if (result) render(result);
        expect(
            screen.getByText('You can make a withdrawal once the verification of your account is complete.')
        ).toBeInTheDocument();
    });

    it('renders correct message when askAuthenticate status received for MF deposit module', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            currency: 'EUR',
            isEuRegion: true,
            module: 'deposit',
        });

        if (result) render(result);
        expect(
            screen.getByText('You can make a new deposit once the verification of your account is complete.')
        ).toBeInTheDocument();
    });

    it('renders correct message when askAuthenticate status received and POI needs verification', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            currency: 'USD',
            poiNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please submit your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
    });

    it('renders correct message when askAuthenticate status received and both POI/POA needs verification', () => {
        const result = getCashierLockedDesc({
            askAuthenticate: true,
            currency: 'USD',
            poaNeedsVerification: true,
            poiNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Your account has not been authenticated. Please submit your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('renders correct message when askFinancialRiskApproval status received', () => {
        const result = getCashierLockedDesc({
            askFinancialRiskApproval: true,
            currency: 'USD',
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete the/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Appropriateness Test' })).toBeInTheDocument();
    });

    it('renders correct message when financialAssessmentRequired status received', () => {
        const result = getCashierLockedDesc({
            currency: 'USD',
            financialAssessmentRequired: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete the/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment' })).toBeInTheDocument();
    });

    it('renders correct message when askTinInformation status received', () => {
        const result = getCashierLockedDesc({
            askTinInformation: true,
            currency: 'USD',
        });

        if (result) render(result);
        expect(screen.getByText(/You have not provided your tax identification number/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Personal details' })).toBeInTheDocument();
    });

    it('renders correct message when askSelfExclusionMaxTurnoverSet status received', () => {
        const result = getCashierLockedDesc({
            askSelfExclusionMaxTurnoverSet: true,
            currency: 'USD',
        });

        if (result) render(result);
        expect(
            screen.getByText(
                /Your access to USD Wallet has been temporarily disabled as you have not set your 30-day turnover limit/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Self-exclusion' })).toBeInTheDocument();
    });

    it('renders correct message when askFixDetails status received', () => {
        const result = getCashierLockedDesc({
            askFixDetails: true,
            currency: 'USD',
        });

        if (result) render(result);
        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable deposits and withdrawals/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });
});
