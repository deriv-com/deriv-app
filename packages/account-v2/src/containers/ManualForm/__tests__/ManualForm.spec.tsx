import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MANUAL_DOCUMENT_TYPES } from '../../../constants/manualFormConstants';
import { ManualForm } from '../ManualForm';

jest.mock('react-calendar/dist/Calendar.css', () => jest.fn());
jest.mock('../../../hooks', () => ({
    useManualForm: jest.fn(() => ({ isExpiryDateRequired: true })),
}));

describe('ManualForm', () => {
    const mockProps: React.ComponentProps<typeof ManualForm> = {
        formData: {},
        isExpiryDateRequired: false,
        onCancel: jest.fn(),
        onSubmit: jest.fn(),
        selectedDocument: 'driving_licence',
    };

    const renderComponent = (props = mockProps) => {
        render(
            <APIProvider>
                <AuthProvider>
                    <ManualForm {...props} />
                </AuthProvider>
            </APIProvider>
        );
    };

    it('should render the header texts correctly for the document Driving licence', () => {
        renderComponent();
        expect(screen.getByText(/First, enter your Driving licence number and the expiry date./)).toBeInTheDocument();
        expect(screen.getByText(/Next, upload the front and back of your driving licence./)).toBeInTheDocument();
    });

    it('should render the header texts correctly for the document Passport', () => {
        const newProps = { ...mockProps, selectedDocument: MANUAL_DOCUMENT_TYPES.passport };
        renderComponent(newProps);
        expect(screen.getByText(/First, enter your Passport number and the expiry date./)).toBeInTheDocument();
        expect(
            screen.getByText(/Next, upload the page of your passport that contains your photo./)
        ).toBeInTheDocument();
    });

    it('should render the header texts correctly for the document Identity card', () => {
        const newProps = { ...mockProps, selectedDocument: MANUAL_DOCUMENT_TYPES.nationalIdentityCard };
        renderComponent(newProps);
        expect(screen.getByText(/First, enter your Identity card number and the expiry date./)).toBeInTheDocument();
        expect(screen.getByText(/Next, upload the front and back of your identity card./)).toBeInTheDocument();
    });

    it('should render the header texts correctly for the document NIMC slip', () => {
        const newProps = { ...mockProps, selectedDocument: MANUAL_DOCUMENT_TYPES.nimcSlip };
        renderComponent(newProps);
        expect(screen.getByText(/First, enter your NIMC slip number./)).toBeInTheDocument();
        expect(
            screen.getByText(/Next, upload the page of your NIMC slip that contains your photo./)
        ).toBeInTheDocument();
    });

    it('should display the error message if the document number is empty', async () => {
        const newProps = { ...mockProps, selectedDocument: MANUAL_DOCUMENT_TYPES.passport };
        renderComponent(newProps);
        userEvent.type(screen.getByRole('textbox', { name: 'Passport number*' }), '');
        userEvent.tab();
        expect(await screen.findByText(/Passport number is required./)).toBeInTheDocument();
    });

    it('should display the error message if the document expiry date is empty', async () => {
        const newProps = { ...mockProps, isExpiryDateRequired: true, selectedDocument: MANUAL_DOCUMENT_TYPES.passport };
        renderComponent(newProps);
        userEvent.type(screen.getByRole('textbox', { name: 'Expiry date*' }), '');
        userEvent.tab();
        expect(await screen.findByText(/Expiry date is required./)).toBeInTheDocument();
    });

    it('should render the footer items correctly', () => {
        renderComponent();
        expect(screen.getByText(/A clear colour photo or scanned image/)).toBeInTheDocument();
        expect(screen.getByText(/JPEG, JPG, PNG, PDF, or GIF/)).toBeInTheDocument();
        expect(screen.getByText(/Less than 8MB/)).toBeInTheDocument();
        expect(screen.getByText(/Must be valid for at least 6 months/)).toBeInTheDocument();
    });
});
