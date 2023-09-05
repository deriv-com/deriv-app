import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AdditionalKycInfoForm } from '../additional-kyc-info-form';

// Mock useSettings hook to prevent errors
jest.mock('../../../../../api/src/hooks', () => ({
    useSettings: () => ({
        update: jest.fn(),
        mutation: { isLoading: false, isSuccess: false, error: null, isError: false },
    }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    generateValidationFunction: jest.fn(),
}));

const mock_store = mockStore({});

describe('AdditionalKycInfoForm', () => {
    const setError = jest.fn();
    it('should render the form fields', () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        // Assert that form fields are rendered
        expect(screen.getByTestId('place_of_birth')).toBeInTheDocument();
        expect(screen.getByTestId('tax_residence')).toBeInTheDocument();
        expect(screen.getByTestId('tax_identification_number')).toBeInTheDocument();
        expect(screen.getByTestId('account_opening_reason')).toBeInTheDocument();
    });

    it('should submit the form when all fields are valid', async () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });
        expect(submit_btn).toBeDisabled();

        // Fill in the form fields with valid data
        fireEvent.change(screen.getByTestId('place_of_birth'), { target: { value: 'Ghana' } });
        fireEvent.change(screen.getByTestId('tax_residence'), { target: { value: 'Ghana' } });
        fireEvent.change(screen.getByTestId('tax_identification_number'), { target: { value: 'GHA-000000000-0' } });
        fireEvent.change(screen.getByTestId('account_opening_reason'), { target: { value: 'Speculative' } });

        await waitFor(() => {
            expect(submit_btn).toBeEnabled();
        });
        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));
    });

    it('should show an error message if form validation fails', async () => {
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });
        expect(submit_btn).toBeDisabled();

        // Fill in the form fields with valid data
        fireEvent.change(screen.getByTestId('place_of_birth'), { target: { value: 'Ghana' } });
        fireEvent.change(screen.getByTestId('tax_residence'), { target: { value: 'Ghana' } });
        fireEvent.change(screen.getByTestId('tax_identification_number'), { target: { value: 'GHA-000000000' } });
        fireEvent.change(screen.getByTestId('account_opening_reason'), { target: { value: 'Speculative' } });

        fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));
    });
});
