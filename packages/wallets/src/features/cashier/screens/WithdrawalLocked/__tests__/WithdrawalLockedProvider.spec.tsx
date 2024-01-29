import { fireEvent, render, screen } from '@testing-library/react';
import withdrawalLockedProvider from '../WithdrawalLockedProvider';

window.LC_API = {
    on_chat_ended: jest.fn(),
    open_chat_window: jest.fn(),
};

describe('WithdrawalLockedProvider', () => {
    it('should render title and description as undefined when withdrawal is not locked', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: false,
            withdrawalLockedStatus: false,
        });

        expect(result?.title).toBeUndefined();
        expect(result?.description).toBeUndefined();
    });

    it('should render correct message when withdrawal limit is reached and POI has not been uploaded', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'none',
            withdrawalLimitReached: true,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/You have reached the withdrawal limit. Please upload/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POI has been uploaded but not yet verified', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'pending',
            withdrawalLimitReached: true,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POA has not been uploaded', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: true,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: true,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/You have reached the withdrawal limit. Please upload/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and POA has been uploaded but not yet verified', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: true,
            poaStatus: 'pending',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: true,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('should render correct message when withdrawal limit is reached and askFinancialRiskApproval status received', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: true,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: true,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/You have reached the withdrawal limit. Please complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('should render correct message when financialAssessmentRequired status received', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: true,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/You can only make deposits. Please complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment' })).toBeInTheDocument();
    });

    it('should render correct message when askAuthenticate status received', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: true,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/Your account has not been authenticated. Please submit/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('should render correct message when askFixDetails status received', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: true,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable withdrawals/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });

    it('should render correct message when noWithdrawalOrTradingStatus status received', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: true,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: false,
            withdrawalLockedStatus: false,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/Unfortunately, you can only make deposits. Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LC_API.open_chat_window).toHaveBeenCalled();
    });

    it('should render correct message when withdrawalLockedStatus status received', () => {
        const result = withdrawalLockedProvider({
            askAuthenticate: false,
            askFinancialRiskApproval: false,
            askFixDetails: false,
            currency: 'USD',
            financialAssessmentRequired: false,
            noWithdrawalOrTradingStatus: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            withdrawalLimitReached: false,
            withdrawalLockedStatus: true,
        });

        if (result) render(result.title);
        expect(screen.getByText('Withdrawals from your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/Unfortunately, you can only make deposits. Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LC_API.open_chat_window).toHaveBeenCalled();
    });
});
