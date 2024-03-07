import React, { ComponentProps } from 'react';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelfieDocumentUpload } from '../SelfieDocumentUpload';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

describe('SelfieDocumentUpload', () => {
    const mockHandleCancel = jest.fn();
    const mockHandleSubmit = jest.fn();

    const mockProps: ComponentProps<typeof SelfieDocumentUpload> = {
        formData: {},
        handleCancel: mockHandleCancel,
        handleSubmit: mockHandleSubmit,
    };

    it('should render component', () => {
        render(<SelfieDocumentUpload {...mockProps} />);

        expect(screen.getAllByText(/Upload your selfie/i)).toHaveLength(2);
        expect(screen.getAllByRole('button')).toHaveLength(3);
        expect(screen.getByRole('button', { name: /Drop file or click here to upload/i })).toBeInTheDocument();
    });

    it('should render component in mobile mode', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<SelfieDocumentUpload {...mockProps} />);
        expect(screen.getAllByText(/Upload your selfie/i)).toHaveLength(2);
        expect(screen.getAllByRole('button')).toHaveLength(3);
        expect(screen.getByText(/Tap here to upload/i)).toBeInTheDocument();
    });

    it('should disable Confirm and upload button when no file is uploaded but enable Back button', () => {
        render(<SelfieDocumentUpload {...mockProps} />);
        expect(screen.getByRole('button', { name: /Confirm and upload/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Back/i })).toBeEnabled();
    });

    it('should enable Confirm and upload button when file is uploaded via drag and drop', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        const file = new File(['file'], 'ping.jpg', {
            type: 'image/jpg',
        });
        window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url');
        render(<SelfieDocumentUpload {...mockProps} />);
        const dropZoneEl = screen.getByTestId('dt_dropzone_input');
        userEvent.upload(dropZoneEl, file);

        expect(await screen.findByRole('button', { name: /Confirm and upload/i })).toBeEnabled();
    });

    it('should enable Confirm and upload button when file is uploaded via file input', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        render(<SelfieDocumentUpload {...mockProps} />);
        const file = new File(['file'], 'ping.jpg', {
            type: 'image/jpg',
        });
        const dropZoneEl = screen.getByTestId('dt_dropzone_input');
        fireEvent.change(dropZoneEl, { target: { files: [file] } });

        expect(await screen.findByRole('button', { name: /Confirm and upload/i })).toBeEnabled();
    });
});
