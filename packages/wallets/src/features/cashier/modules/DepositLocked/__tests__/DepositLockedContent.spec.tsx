import { Chat } from '@deriv/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getDepositLockedDesc from '../DepositLockedContent';

describe('DepositLockedContent', () => {
    beforeEach(() => {
        jest.spyOn(Chat, 'open').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('renders title and description as undefined when deposit is not locked', () => {
        const result = getDepositLockedDesc({});

        expect(result).toBeFalsy();
    });

    it('renders correct message when POI has not been verified', () => {
        const result = getDepositLockedDesc({
            hasAttemptedPOI: true,
            poiNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must check/)).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'proof of identity document verification status' })
        ).toBeInTheDocument();
    });

    it('renders correct message when POA has not been verified', () => {
        const result = getDepositLockedDesc({
            hasAttemptedPOA: true,
            poaNeedsVerification: true,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must check/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address document verification status' })).toBeInTheDocument();
    });

    it('renders correct message when latest TnC has not been accepted', () => {
        const result = getDepositLockedDesc({
            isTNCNeeded: true,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must accept/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'updated terms and conditions' })).toBeInTheDocument();
    });

    it('renders correct message when financial information is pending for MF accounts', () => {
        const result = getDepositLockedDesc({
            financialInformationNotComplete: true,
            isMFAccount: true,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('renders correct message when trading experience information is pending for MF accounts', () => {
        const result = getDepositLockedDesc({
            isMFAccount: true,
            tradingExperienceNotComplete: true,
        });

        if (result) render(result);
        expect(screen.getByText(/To enable deposits, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('renders correct message when askFixDetails status received', () => {
        const result = getDepositLockedDesc({
            askFixDetails: true,
        });

        if (result) render(result);
        expect(
            screen.getByText(/Please go to your account settings and complete your personal details to enable deposits/)
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });

    it('renders correct message when selfExclusion status received', async () => {
        const result = getDepositLockedDesc({
            excludedUntil: new Date('01/01/2100'),
            selfExclusion: true,
        });

        if (result) render(result);
        expect(
            screen.getByText(/You have chosen to exclude yourself from trading on our website until 01 Jan 2100/)
        ).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        await userEvent.click(link);
        expect(Chat.open).toHaveBeenCalledTimes(1);
    });

    it('renders correct message when unwelcomeStatus status received', async () => {
        const result = getDepositLockedDesc({
            unwelcomeStatus: true,
        });

        if (result) render(result);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        await userEvent.click(link);
        expect(Chat.open).toHaveBeenCalledTimes(1);
    });
});
