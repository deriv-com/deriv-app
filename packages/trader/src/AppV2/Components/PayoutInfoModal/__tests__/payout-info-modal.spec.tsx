import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PayoutInfoModal from '../payout-info-modal';

describe('PayoutInfoModal', () => {
    const bodyContent = 'This is the body content of the modal.';

    it('should render the button and modal content correctly', () => {
        render(<PayoutInfoModal body_content={bodyContent} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(screen.getByText('How do I earn a payout?')).toBeInTheDocument();
        expect(screen.queryByText(bodyContent)).not.toBeInTheDocument();
    });

    it('should toggle the modal visibility when the button is clicked', async () => {
        render(<PayoutInfoModal body_content={bodyContent} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);
        expect(screen.getByText(bodyContent)).toBeInTheDocument();

        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.queryByText(bodyContent)).not.toBeInTheDocument();
        });
    });

    it('should close the modal when the primary button is clicked', async () => {
        render(<PayoutInfoModal body_content={bodyContent} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(screen.getByText(bodyContent)).toBeInTheDocument();

        const primaryButton = screen.getByText('Got it');
        await userEvent.click(primaryButton);

        await waitFor(() => {
            expect(screen.queryByText(bodyContent)).not.toBeInTheDocument();
        });
    });
});
