import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DisclaimerDialog from '../DisclaimerDialog';
import userEvent from '@testing-library/user-event';

const mockedMutateAsync = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    useMutation: jest.fn(() => ({
        mutateAsync: mockedMutateAsync,
        isLoading: false,
    })),
}));

describe('DisclaimerDialog', () => {
    let mockedProps: React.ComponentProps<typeof DisclaimerDialog>;

    beforeEach(() => {
        mockedProps = {
            handleDisclaimerDialog: jest.fn(),
            isOpen: true,
            providerServiceName: 'banxa',
        };
    });

    it('should show proper content in disclaimer dialog', () => {
        render(<DisclaimerDialog {...mockedProps} />);

        expect(screen.getByText('Disclaimer')).toBeInTheDocument();
        expect(
            screen.getByText(
                "By clicking 'Continue' you will be redirected to Banxa, a third-party payment service provider. Please note that Deriv is not responsible for the content or services provided by Banxa. If you encounter any issues related to Banxa services, you must contact Banxa directly."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('should trigger handleDisclaimerDialog callback when user closes the dialog on cross icon', () => {
        render(<DisclaimerDialog {...mockedProps} />);

        const closeCrossIcon = screen.getByTestId('dt-close-icon');
        userEvent.click(closeCrossIcon);

        expect(mockedProps.handleDisclaimerDialog).toHaveBeenCalledWith(false);
    });

    it('should trigger mutateAsync callback when user clicks on `Continue` button', async () => {
        mockedMutateAsync.mockResolvedValue({ service_token: 'banxa' });
        render(<DisclaimerDialog {...mockedProps} />);

        const continueButton = screen.getByRole('button', { name: 'Continue' });
        userEvent.click(continueButton);

        expect(mockedMutateAsync).toHaveBeenCalledWith({
            payload: { referrer: 'http://localhost/', service: 'banxa' },
        });
        await waitFor(() => {
            expect(mockedProps.handleDisclaimerDialog).toHaveBeenCalledWith(false);
        });
    });

    it('should trigger handleDisclaimerDialog callback when user clicks on `Cancel` button', () => {
        render(<DisclaimerDialog {...mockedProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancelButton);

        expect(mockedProps.handleDisclaimerDialog).toHaveBeenCalledWith(false);
    });
});
