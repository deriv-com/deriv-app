import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getWithdrawalLockedDesc, { getWithdrawalLimitReachedDesc } from '../WithdrawalLockedContent';

window.LiveChatWidget = {
    call: jest.fn(),
    get: jest.fn(),
    init: jest.fn(),
    on: jest.fn(),
};

describe('WithdrawalLockedContent', () => {
    it('renders title and description as undefined when withdrawal limit is not reached', () => {
        const result = getWithdrawalLimitReachedDesc({
            isVerified: true,
        });

        expect(result).toBeFalsy();
    });

    it('renders title and description as undefined when withdrawal is not locked', () => {
        const result = getWithdrawalLockedDesc({});

        expect(result).toBeFalsy();
    });

    it('renders correct message when withdrawal limit is reached and POI has not been uploaded', () => {
        const result = getWithdrawalLimitReachedDesc({
            isVerified: true,
            poiNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('renders correct message when withdrawal limit is reached and POA has not been uploaded', () => {
        const result = getWithdrawalLimitReachedDesc({
            isVerified: true,
            poaNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('renders correct message when withdrawal limit is reached and POI/POA is not yet verified', () => {
        const result = getWithdrawalLimitReachedDesc({
            isVerified: false,
        });

        if (result) render(result);
        expect(screen.getByText(/You have reached the withdrawal limit. Please check your/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'address' })).toBeInTheDocument();
    });

    it('renders correct message when withdrawal limit is reached and askFinancialRiskApproval status received', () => {
        const result = getWithdrawalLimitReachedDesc({
            askFinancialRiskApproval: true,
            isVerified: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('renders correct message when financialAssessmentRequired status received', () => {
        const result = getWithdrawalLockedDesc({
            financialAssessmentRequired: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please complete the/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment' })).toBeInTheDocument();
    });

    it('renders correct message when askAuthenticate status received', () => {
        const result = getWithdrawalLockedDesc({
            askAuthenticate: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Your account has not been authenticated. Please submit/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of identity' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address' })).toBeInTheDocument();
    });

    it('renders correct message when askFixDetails status received', () => {
        const result = getWithdrawalLockedDesc({
            askFixDetails: true,
        });

        if (result) render(result);
        expect(
            screen.getByText(
                /Please go to your account settings and complete your personal details to enable withdrawals/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });

    it('renders correct message when noWithdrawalOrTradingStatus status received', async () => {
        const result = getWithdrawalLockedDesc({
            noWithdrawalOrTradingStatus: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Unfortunately, you can only make deposits. Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        await userEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });

    it('renders correct message when withdrawalLockedStatus status received', async () => {
        const result = getWithdrawalLockedDesc({
            withdrawalLockedStatus: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Unfortunately, you can only make deposits. Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        await userEvent.click(link);
        expect(window.LiveChatWidget.call).toHaveBeenCalledWith('maximize');
    });
});
