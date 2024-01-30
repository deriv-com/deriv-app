import { fireEvent, render, screen } from '@testing-library/react';
import getDepositLockedContent from '../DepositLockedContent';

window.LC_API = {
    on_chat_ended: jest.fn(),
    open_chat_window: jest.fn(),
};

describe('DepositLockedContent', () => {
    it('should render title and description as undefined when deposit is not locked', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        expect(result?.title).toBeUndefined();
        expect(result?.description).toBeUndefined();
    });

    it('should render correct message when POI has not been verified', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: true,
            poiStatus: 'pending',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/To enable deposits, you must check/)).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'proof of identity document verification status' })
        ).toBeInTheDocument();
    });

    it('should render correct message when POA has not been verified', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: true,
            poaStatus: 'pending',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/To enable deposits, you must check/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'proof of address document verification status' })).toBeInTheDocument();
    });

    it('should render correct message when latest TnC has not been accepted', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'not latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/To enable deposits, you must accept/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'updated terms and conditions' })).toBeInTheDocument();
    });

    it('should render correct message when financial information is pending for MF accounts', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: true,
            isMFAccount: true,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/To enable deposits, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('should render correct message when trading experience information is pending for MF accounts', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: true,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: true,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/To enable deposits, you must complete/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'financial assessment form' })).toBeInTheDocument();
    });

    it('should render correct message when askFixDetails status received', () => {
        const result = getDepositLockedContent({
            askFixDetails: true,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(
            screen.getByText(/Please go to your account settings and complete your personal details to enable deposits/)
        ).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'personal details' })).toBeInTheDocument();
    });

    it('should render correct message when selfExclusion status received', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: new Date('01/01/2100'),
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: true,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: false,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(
            screen.getByText(
                /You have chosen to exclude yourself from trading on our website until Fri Jan 01 2100 00:00:00/
            )
        ).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LC_API.open_chat_window).toHaveBeenCalled();
    });

    it('should render correct message when unwelcomeStatus status received', () => {
        const result = getDepositLockedContent({
            askFixDetails: false,
            clientTncStatus: 'latest',
            currency: 'USD',
            excludedUntil: undefined,
            financialInformationNotComplete: false,
            isMFAccount: false,
            poaNeedsVerification: false,
            poaStatus: 'none',
            poiNeedsVerification: false,
            poiStatus: 'none',
            selfExclusion: false,
            tradingExperienceNotComplete: false,
            unwelcomeStatus: true,
            websiteTncVersion: 'latest',
        });

        if (result) render(result.title);
        expect(screen.getByText('Deposits into your USD Wallet are temporarily locked.')).toBeInTheDocument();

        if (result) render(result.description);
        expect(screen.getByText(/Please contact us/)).toBeInTheDocument();
        const link = screen.getByText('live chat');
        expect(link).toBeInTheDocument();
        fireEvent.click(link);
        expect(window.LC_API.open_chat_window).toHaveBeenCalled();
    });
});
