import React from 'react';
import { APIProvider, AuthProvider, useSettings } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddressDetailsForm } from '../AddressDetailsForm';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('../DocumentSubmission', () => ({
    DocumentSubmission: () => <div>DocumentSubmission</div>,
}));

const updateSettings = jest.fn();
const mockUploadDocument = jest.fn();
const mockDefaultSettings = {
    data: {
        country_code: 'id',
    },
    error: undefined,
    mutation: {
        error: undefined,
        isLoading: false,
        mutateAsync: updateSettings,
    },
};

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useDocumentUpload: jest.fn(() => ({
        error: undefined,
        isLoading: false,
        upload: mockUploadDocument,
    })),
    useInvalidateQuery: jest.fn(() => jest.fn()),
    useSettings: jest.fn(() => mockDefaultSettings),
}));

describe('AddressDetailsForm', () => {
    it('should render the form with initial values', () => {
        (useSettings as jest.Mock).mockImplementation(() => ({
            ...mockDefaultSettings,
            data: {
                address_city: 'New York',
                address_line_1: '125 Main St',
                address_line_2: 'Apt 4B',
                address_postcode: '10001',
                address_state: 'NY',
            },
        }));
        render(
            <APIProvider>
                <AuthProvider>
                    <AddressDetailsForm />
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByLabelText('Town/City*')).toHaveValue('New York');
        expect(screen.getByLabelText('First line of address*')).toHaveValue('125 Main St');
        expect(screen.getByLabelText('Second line of address')).toHaveValue('Apt 4B');
        expect(screen.getByLabelText('Postal/ZIP Code')).toHaveValue('10001');
        expect(screen.getByLabelText('State/Province')).toHaveValue('NY');
    });

    it('should submit the form with updated values when "Save and Submit" button is clicked', async () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <AddressDetailsForm />
                </AuthProvider>
            </APIProvider>
        );

        // Simulate user input
        const city = screen.getByLabelText('Town/City*');
        userEvent.clear(city);
        userEvent.type(city, 'London');
        const address1 = screen.getByLabelText('First line of address*');
        userEvent.clear(address1);
        userEvent.type(address1, '121 Main St');
        const address2 = screen.getByLabelText('Second line of address');
        userEvent.clear(address2);
        userEvent.type(address2, 'Apt 4AC');
        const zipCode = screen.getByLabelText('Postal/ZIP Code');
        userEvent.clear(zipCode);
        userEvent.type(zipCode, '1011');
        const state = screen.getByLabelText('State/Province');
        userEvent.clear(state);
        userEvent.type(state, 'GB');

        const submitButton = screen.getByText('Save and Submit');

        userEvent.click(submitButton);

        await waitFor(() => {
            expect(updateSettings).toHaveBeenCalledWith({
                payload: {
                    address_city: 'London',
                    address_line_1: '121 Main St',
                    address_line_2: 'Apt 4AC',
                    address_postcode: '1011',
                    address_state: 'GB',
                },
            });
            expect(mockUploadDocument).toHaveBeenCalled();
        });
    });

    it('should show Proof of address on Mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isMobile: true }));

        render(
            <APIProvider>
                <AuthProvider>
                    <AddressDetailsForm />
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByText('Proof of address')).toBeInTheDocument();
    });

    it('should show resubmitting message', () => {
        render(
            <APIProvider>
                <AuthProvider>
                    <AddressDetailsForm resubmitting />
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByText(/We were unable to verify your address/)).toBeInTheDocument();
    });

    it('should show error component if get api returns error', () => {
        (useSettings as jest.Mock).mockImplementation(() => ({
            ...mockDefaultSettings,
            error: { error: { message: 'Settings not available' } },
        }));

        render(
            <APIProvider>
                <AuthProvider>
                    <AddressDetailsForm resubmitting />
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByText(/Settings not available/)).toBeInTheDocument();
    });

    it('should show error if update api returns error', () => {
        (useSettings as jest.Mock).mockImplementation(() => ({
            ...mockDefaultSettings,
            mutation: { error: { error: { message: 'Settings not updated' } } },
        }));

        render(
            <APIProvider>
                <AuthProvider>
                    <AddressDetailsForm resubmitting />
                </AuthProvider>
            </APIProvider>
        );

        expect(screen.getByText(/Settings not updated/)).toBeInTheDocument();
    });
});
