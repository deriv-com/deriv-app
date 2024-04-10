import React from 'react';
import { useAccountStatus, useActiveTradingAccount, useFinancialAssessment, useIsEuRegion } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from '../../../../constants';
import { FinancialAssessmentForm } from '../FinancialAssessmentForm';

jest.mock('../../../../components/DemoMessage', () => ({
    DemoMessage: () => <div>DemoMessage</div>,
}));

jest.mock('@deriv/api-v2', () => ({
    useAccountStatus: jest.fn(),
    useActiveTradingAccount: jest.fn(),
    useFinancialAssessment: jest.fn(),
    useIsEuRegion: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loading...</div>),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

let elModalRoot: HTMLElement;
beforeAll(() => {
    elModalRoot = document.createElement('div');
    elModalRoot.setAttribute('id', ACCOUNT_MODAL_REF.replace('#', ''));
    document.body.appendChild(elModalRoot);
});

afterAll(() => {
    document.body.removeChild(elModalRoot);
});

const mockUpdate = jest.fn();

const financialAssessmentPayload = {
    account_turnover: 'Less than $50,000',
    education_level: 'Secondary',
    employment_industry: 'Agriculture',
    employment_status: 'Employed',
    estimated_worth: 'Less than $20,000',
    income_source: 'Job',
    net_income: 'Less than $25,000',
    source_of_wealth: 'Salary',
};

beforeEach(() => {
    jest.clearAllMocks();
    (useIsEuRegion as jest.Mock).mockReturnValue({ isEUCountry: false });
    (useFinancialAssessment as jest.Mock).mockReturnValue({
        data: {
            ...financialAssessmentPayload,
            occupation: 'Developer',
        },
        error: undefined,
        isLoading: false,
        mutation: {
            error: undefined,
            isLoading: false,
            isSuccess: false,
        },
        update: mockUpdate,
    });

    (useActiveTradingAccount as jest.Mock).mockReturnValue({
        data: {
            is_virtual: false,
        },
    });
    (useAccountStatus as jest.Mock).mockReturnValue({ data: { is_authenticated: false } });
});

describe('FinancialAssessmentForm', () => {
    it('renders submitted page', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
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

    it('render Demo Message if account virtual', () => {
        (useActiveTradingAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('DemoMessage')).toBeInTheDocument();
    });

    it('show loader when api call in progress', () => {
        (useFinancialAssessment as jest.Mock).mockReturnValue({
            data: {},
            error: undefined,
            isLoading: true,
            mutation: {
                error: undefined,
                isLoading: false,
                isSuccess: false,
            },
            update: jest.fn(),
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('render Error Message on fetch error', () => {
        (useFinancialAssessment as jest.Mock).mockReturnValue({
            data: {},
            error: {
                error: {
                    message: 'Error Loading API',
                },
            },
            isLoading: false,
            mutation: {
                error: undefined,
                isLoading: false,
                isSuccess: false,
            },
            update: jest.fn(),
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Error Loading API')).toBeInTheDocument();
    });

    it('render Update Error Message on update error', () => {
        (useFinancialAssessment as jest.Mock).mockReturnValue({
            data: {},
            error: undefined,
            isLoading: false,
            mutation: {
                error: {
                    error: {
                        message: 'Error Updating API',
                    },
                },
                isLoading: false,
                isSuccess: false,
            },
            update: jest.fn(),
        });
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Error Updating API')).toBeInTheDocument();
    });

    it('renders Financial Assessment form', () => {
        render(<FinancialAssessmentForm />);
        expect(screen.getByText('Financial information')).toBeInTheDocument();
        expect(screen.getByText('(All fields are required)')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Source of income' })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: 'Source of wealth' })).toBeInTheDocument();
    });

    it('calls update function with valid values on form submission', async () => {
        render(<FinancialAssessmentForm />);

        act(() => {
            const wealthSourceField = screen.getByRole('combobox', { name: 'Source of wealth' });
            userEvent.type(wealthSourceField, 'Inheritance');
        });

        act(() => {
            const inheritanceOption = screen.getByRole('option', { name: 'Inheritance' });
            userEvent.click(inheritanceOption);
        });

        const submitButton = screen.getByRole('button', { name: 'Submit' });

        userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({
                ...financialAssessmentPayload,
                occupation: 'Developer',
                source_of_wealth: 'Inheritance',
            });
        });
    });

    it('calls update function without occupation if employment status un-employed on form submission', async () => {
        render(<FinancialAssessmentForm />);

        act(() => {
            const employmentStatusField = screen.getByRole('combobox', { name: 'Employment status' });
            userEvent.type(employmentStatusField, 'Unemployed');
        });

        act(() => {
            const unemploymentOption = screen.getByRole('option', { name: 'Unemployed' });
            userEvent.click(unemploymentOption);
        });

        const submitButton = screen.getByRole('button', { name: 'Submit' });

        userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({
                ...financialAssessmentPayload,
                employment_status: 'Unemployed',
            });
        });
    });
});
