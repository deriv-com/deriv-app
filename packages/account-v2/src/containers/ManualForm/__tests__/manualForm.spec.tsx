import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManualForm } from '../manualForm';

jest.mock('react-calendar/dist/Calendar.css', () => jest.fn());
jest.mock('../../../hooks', () => ({
    useManualForm: jest.fn(() => ({ isExpiryDateRequired: true })),
}));

describe('ManualForm', () => {
    const renderComponent = ({
        selectedDocument,
    }: {
        selectedDocument?: React.ComponentProps<typeof ManualForm>['selectedDocument'];
    }) => {
        const mockProps: React.ComponentProps<typeof ManualForm> = {
            onCancel: jest.fn(),
            onSubmit: jest.fn(),
            selectedDocument: selectedDocument ?? 'driving_licence',
        };
        render(
            <APIProvider>
                <ManualForm {...mockProps} />
            </APIProvider>
        );
    };

    it('should render the header texts correctly for the document Driving licence', () => {
        renderComponent({});
        expect(screen.getByText(/First, enter your Driving licence number and the expiry date./)).toBeInTheDocument();
        expect(screen.getByText(/Next, upload the front and back of your driving licence./)).toBeInTheDocument();
    });

    it('should render the header texts correctly for the document Passport', () => {
        renderComponent({ selectedDocument: 'passport' });
        expect(screen.getByText(/First, enter your Passport number and the expiry date./)).toBeInTheDocument();
        expect(
            screen.getByText(/Next, upload the page of your passport that contains your photo./)
        ).toBeInTheDocument();
    });

    it('should render the header texts correctly for the document Identity card', () => {
        renderComponent({ selectedDocument: 'national_identity_card' });
        expect(screen.getByText(/First, enter your Identity card number and the expiry date./)).toBeInTheDocument();
        expect(screen.getByText(/Next, upload the front and back of your identity card./)).toBeInTheDocument();
    });

    it('should render the header texts correctly for the document NIMC slip', () => {
        renderComponent({ selectedDocument: 'nimc_slip' });
        expect(screen.getByText(/First, enter your NIMC slip number and the expiry date./)).toBeInTheDocument();
        expect(
            screen.getByText(/Next, upload the page of your NIMC slip that contains your photo./)
        ).toBeInTheDocument();
    });

    it('should display the error message if the document number is empty', async () => {
        renderComponent({ selectedDocument: 'passport' });
        userEvent.type(screen.getByRole('textbox', { name: 'Passport number*' }), '');
        userEvent.tab();
        await waitFor(() => {
            expect(screen.getByText(/Passport number is required./)).toBeInTheDocument();
        });
    });

    it('should display the error message if the document expiry date is empty', async () => {
        renderComponent({ selectedDocument: 'passport' });
        await waitFor(() => {
            userEvent.type(screen.getByRole('textbox', { name: 'Expiry date*' }), '');
            userEvent.tab();
            expect(screen.getByText(/Expiry date is required./)).toBeInTheDocument();
        });
    });

    it('should render the footer items correctly', () => {
        renderComponent({});
        expect(screen.getByText(/A clear colour photo or scanned image/)).toBeInTheDocument();
        expect(screen.getByText(/JPEG, JPG, PNG, PDF, or GIF/)).toBeInTheDocument();
        expect(screen.getByText(/Less than 8MB/)).toBeInTheDocument();
        expect(screen.getByText(/Must be valid for at least 6 months/)).toBeInTheDocument();
    });
});
