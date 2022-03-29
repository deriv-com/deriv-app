import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelfExclusionConfirmPage from '../self-exclusion-confirm-page';
import SelfExclusionContext from '../self-exclusion-context';
import * as formik from 'formik';

jest.mock('../self-exclusion-confirm-limits', () => () => <div>SelfExclusionConfirmLimits</div>);

const useFormikContextMock = jest.spyOn(formik, 'useFormikContext');

describe('<SelfExclusionConfirmPage />', () => {
    let mockContext = {};
    beforeEach(() => {
        mockContext = {
            backFromConfirmLimits: jest.fn(),
            currency: 'test currency',
            currency_display: 'test currency',
            exclusion_texts: {},
            is_eu: false,
            state: {
                show_confirm: false,
                submit_error_message: 'Submit error message',
                changed_attributes: [],
            },
        };
        useFormikContextMock.mockReturnValue({
            values: {},
            isSubmitting: false,
        });
    });
    it('should not render SelfExclusionConfirmPage component', () => {
        mockContext.state.show_confirm = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('SelfExclusionConfirmLimits')).toBeInTheDocument();
        expect(screen.queryByText('You have set the following limits:')).not.toBeInTheDocument();
    });

    it('should render SelfExclusionConfirmPage component with options', () => {
        mockContext.exclusion_texts = {
            max_deposit: 'Max deposit is',
            max_total_stake: 'Max total stake is',
            max_open_bets: 'Max open bets are',
            session_duration_limit: 'Session duration limit is',
            timeout_until: 'Timeout until',
        };
        mockContext.state.changed_attributes = [
            'max_deposit',
            'max_total_stake',
            'max_open_bets',
            'session_duration_limit',
            'timeout_until',
        ];
        useFormikContextMock.mockReturnValue({
            values: {
                max_deposit: 987,
                max_total_stake: 97,
                max_open_bets: 13,
                session_duration_limit: 9999,
                timeout_until: 0,
            },
            isSubmitting: false,
        });

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.getByText('Max deposit is')).toBeInTheDocument();
        const arrCurrency = screen.getAllByText(/test currency/);
        expect(arrCurrency.length).toBeGreaterThan(0);
        expect(screen.getByText('Max total stake is')).toBeInTheDocument();
        expect(screen.getByText('Max open bets are')).toBeInTheDocument();
        expect(screen.getByText('Session duration limit is')).toBeInTheDocument();
        expect(screen.getByText('Timeout until')).toBeInTheDocument();
        expect(screen.getByText('13')).toBeInTheDocument();
    });

    it('Should trigger click on the "Back" icon', () => {
        const backFromConfirmLimits = mockContext.backFromConfirmLimits;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        const btn = screen.getByText('Back');
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(backFromConfirmLimits).toHaveBeenCalledTimes(1);
    });

    it('should render SelfExclusionConfirmPage component for non EU', () => {
        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.queryByText('SelfExclusionConfirmLimits')).not.toBeInTheDocument();
        expect(screen.getByText(/We’ll update your limits./)).toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.getByText('Submit error message')).toBeInTheDocument();
        expect(screen.queryByText(/You’ll be able to adjust these limits at any time./)).not.toBeInTheDocument();
    });

    it('should render SelfExclusionConfirmPage component for EU', () => {
        mockContext.is_eu = true;

        render(
            <SelfExclusionContext.Provider value={mockContext}>
                <SelfExclusionConfirmPage />
            </SelfExclusionContext.Provider>
        );

        expect(screen.queryByText('SelfExclusionConfirmLimits')).not.toBeInTheDocument();
        expect(screen.queryByText(/We’ll update your limits./)).not.toBeInTheDocument();
        expect(screen.getByText('You have set the following limits:')).toBeInTheDocument();
        expect(screen.getByText('Submit error message')).toBeInTheDocument();
        expect(screen.getByText(/You’ll be able to adjust these limits at any time./)).toBeInTheDocument();
    });

    it('Should trigger click on the "Accept" button for non EU', () => {
        const handleSubmit = jest.fn();

        render(
            <form onSubmit={handleSubmit} data-testid='form'>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionConfirmPage />
                </SelfExclusionContext.Provider>
            </form>
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Accept');
        fireEvent.submit(screen.getByTestId('form'));
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('Should trigger click on the "Confirm my limits" button for EU', () => {
        mockContext.is_eu = true;
        const handleSubmit = jest.fn();

        render(
            <form onSubmit={handleSubmit} data-testid='form'>
                <SelfExclusionContext.Provider value={mockContext}>
                    <SelfExclusionConfirmPage />
                </SelfExclusionContext.Provider>
            </form>
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent('Confirm my limits');
        fireEvent.submit(screen.getByTestId('form'));
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
});
