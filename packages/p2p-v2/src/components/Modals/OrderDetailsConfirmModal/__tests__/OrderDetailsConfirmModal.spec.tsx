import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderDetailsConfirmModal from '../OrderDetailsConfirmModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: () => ({
        isMobile: false,
    }),
}));

const mockProps = {
    isModalOpen: true,
    onRequestClose: jest.fn(),
};

describe('<OrderDetailsConfirmModal />', () => {
    it('should render the modal’s default screen', () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        expect(screen.getByText('Payment confirmation')).toBeInTheDocument();
        expect(
            screen.getByText(
                /Please make sure that you’ve paid 9.99 IDR to client CR90000012, and upload the receipt as proof of your payment/
            )
        ).toBeInTheDocument();
        expect(screen.getByText('We accept JPG, PDF, or PNG (up to 5MB).')).toBeInTheDocument();
        expect(
            screen.getByText('Sending forged documents will result in an immediate and permanent ban.')
        ).toBeInTheDocument();
        expect(screen.getByText('Upload receipt here')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
    });

    it('should handle accepted files', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('dt_p2p_v2_file_upload_input') as HTMLInputElement;

        userEvent.upload(fileInput, file);

        await waitFor(() => {
            if (fileInput.files) {
                expect(fileInput.files[0]).toBe(file);
                expect(fileInput.files).toHaveLength(1);
            }
        });

        expect(screen.getByText('test.png')).toBeInTheDocument();
    });

    it('should show error message if file is not supported', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
        const fileInput = screen.getByTestId('dt_p2p_v2_file_upload_input');

        userEvent.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText('The file you uploaded is not supported. Upload another.')).toBeInTheDocument();
        });
    });

    it('should show error message if file is over 5MB', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const blob = new Blob([new Array(6 * 1024 * 1024).join('a')], { type: 'image/png' });
        const file = new File([blob], 'test.png');
        const fileInput = screen.getByTestId('dt_p2p_v2_file_upload_input');

        userEvent.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText('Cannot upload a file over 5MB')).toBeInTheDocument();
        });
    });

    it('should remove file when close icon is clicked', async () => {
        render(<OrderDetailsConfirmModal {...mockProps} />);

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const fileInput = screen.getByTestId('dt_p2p_v2_file_upload_input');

        userEvent.upload(fileInput, file);

        await waitFor(() => {
            expect(screen.getByText('test.png')).toBeInTheDocument();
        });

        const closeIcon = screen.getByTestId('dt_p2p_v2_remove_file_icon');

        userEvent.click(closeIcon);

        await waitFor(() => {
            expect(screen.queryByText('test.png')).not.toBeInTheDocument();
        });
    });
});
