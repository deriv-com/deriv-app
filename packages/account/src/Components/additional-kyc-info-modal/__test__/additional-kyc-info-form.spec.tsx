import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { AdditionalKycInfoForm } from '../additional-kyc-info-form';
import userEvent from '@testing-library/user-event';
import { useSettings } from '@deriv/api';
import { TSocketError } from '@deriv/api/types';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useSettings: jest.fn(),
}));

const mockedUseSettings = useSettings as jest.Mock;

type TMutation = Partial<ReturnType<typeof useSettings>['mutation']>;

type TMockConfig = Omit<ReturnType<typeof useSettings>, 'mutation'> & {
    mutation: TMutation;
};

const mock_settings: Partial<TMockConfig> = {
    update: jest.fn(),
    mutation: { isLoading: false, isSuccess: false, error: null, isError: false },
    data: {
        tax_identification_number: '',
        tax_residence: '',
        place_of_birth: '',
        account_opening_reason: '',
        has_submitted_personal_details: false,
    },
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    generateValidationFunction: jest.fn(),
}));

describe('AdditionalKycInfoForm', () => {
    const setError = jest.fn();
    const mock_store = mockStore({});

    it('should render the form fields', () => {
        mockedUseSettings.mockReturnValue(mock_settings);
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_place_of_birth')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tax_residence')).toBeInTheDocument();
        expect(screen.getByTestId('dt_tax_identification_number')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_opening_reason')).toBeInTheDocument();
    });

    it('should render loading state upon fetching data', () => {
        mockedUseSettings.mockReturnValue({ ...mock_settings, isLoading: true });
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should submit the form when all fields are valid', async () => {
        mockedUseSettings.mockReturnValue(mock_settings);
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });

        userEvent.type(screen.getByTestId('dt_place_of_birth'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_residence'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_identification_number'), 'GHA-000000000-0');
        userEvent.type(screen.getByTestId('dt_account_opening_reason'), 'Speculative');

        await waitFor(() => {
            expect(submit_btn).toBeEnabled();
        });
        userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(mockedUseSettings).toHaveBeenCalled();
    });

    it('should be able to submit the form without filling optional fields', async () => {
        mockedUseSettings.mockReturnValue(mock_settings);
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });

        userEvent.type(screen.getByTestId('dt_place_of_birth'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_account_opening_reason'), 'Speculative');

        await waitFor(() => {
            expect(submit_btn).toBeEnabled();
        });
        userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(mockedUseSettings).toHaveBeenCalled();
    });

    it('should show an error message if form validation fails', async () => {
        mockedUseSettings.mockReturnValue({
            ...mock_settings,
            mutation: {
                ...mock_settings.mutation,
                isError: true,
                status: 'error',
                error: {
                    message: 'Invalid TIN format',
                } as unknown as TSocketError<'set_settings'>,
            },
        });
        render(
            <StoreProvider store={mock_store}>
                <AdditionalKycInfoForm setError={setError} />
            </StoreProvider>
        );

        const submit_btn = screen.getByRole('button', { name: 'Submit' });

        userEvent.type(screen.getByTestId('dt_place_of_birth'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_residence'), 'Ghana');
        userEvent.type(screen.getByTestId('dt_tax_identification_number'), 'GHA-00000000');
        userEvent.type(screen.getByTestId('dt_account_opening_reason'), 'Speculative');

        userEvent.click(submit_btn);

        expect(mockedUseSettings).toHaveBeenCalled();
        expect(setError).toHaveBeenCalled();
    });
});
