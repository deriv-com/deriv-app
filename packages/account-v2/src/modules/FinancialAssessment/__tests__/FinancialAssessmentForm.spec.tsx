import React from 'react';
import { useAccountStatus, useActiveTradingAccount, useFinancialAssessment, useIsEuRegion } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import { FinancialAssessmentForm } from '../FinancialAssessmentForm';

jest.mock('../../FinancialAssessmentFields', () => ({
    FinancialAssessmentFields: () => <div>FinancialAssessmentFields</div>,
}));
jest.mock('../../TradingExperienceFields', () => ({
    TradingExperienceFields: () => <div>TradingExperienceFields</div>,
}));

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveTradingAccount: jest.fn(),
    useFinancialAssessment: jest.fn(),
    useIsEuRegion: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

describe('FinancialAssessmentForm', () => {
    it('renders submitted page', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_authenticated: true } });
        (useIsEuRegion as jest.Mock).mockReturnValue({ isEUCountry: false });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: false,
            },
        });
        (useFinancialAssessment as jest.Mock).mockReturnValue({
            data: {},
            error: undefined,
            isLoading: false,
            mutation: {
                error: undefined,
                isLoading: false,
                isSuccess: true,
            },
            update: jest.fn(),
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Financial assessment submitted successfully')).toBeInTheDocument();
        expect(screen.getByText('Let’s continue with providing proofs of address and identity.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('renders Financial Assessment form', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_authenticated: true } });
        (useIsEuRegion as jest.Mock).mockReturnValue({ isEUCountry: false });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: false,
            },
        });
        (useFinancialAssessment as jest.Mock).mockReturnValue({
            data: {},
            error: undefined,
            isLoading: false,
            mutation: {
                error: undefined,
                isLoading: false,
                isSuccess: false,
            },
            update: jest.fn(),
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Financial information')).toBeInTheDocument();
        expect(screen.getByText('(All fields are required)')).toBeInTheDocument();
        expect(screen.getByText('FinancialAssessmentFields')).toBeInTheDocument();
    });

    it('renders Trading Experience form', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_trading_experience_not_complete: true } });
        (useIsEuRegion as jest.Mock).mockReturnValue({ isEUCountry: false });
        (useActiveTradingAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: false,
            },
        });
        (useFinancialAssessment as jest.Mock).mockReturnValue({
            data: {},
            error: undefined,
            isLoading: false,
            mutation: {
                error: undefined,
                isLoading: false,
                isSuccess: false,
            },
            update: jest.fn(),
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Trading experience')).toBeInTheDocument();
        expect(screen.getAllByText('(All fields are required)')).toHaveLength(2);
        expect(screen.getByText('TradingExperienceFields')).toBeInTheDocument();
    });
});
