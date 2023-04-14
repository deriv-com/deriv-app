import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { isMobile, isDesktop } from '@deriv/shared';
import FileUploaderComponent from '../file-uploader-component';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(),
    isMobile: jest.fn(),
    compressImageFiles: jest.fn(() => Promise.resolve([{ path: 'hello.pdf' }])),
    readFiles: jest.fn(),
}));

jest.mock('@binary-com/binary-document-uploader');

describe('<FileUploaderComponent />', () => {
    beforeEach(() => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        jest.clearAllMocks();
    });

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const props = {
        accept: 'image/pdf, image/png',
        filename_limit: 26,
        max_size: 2097152,
        multiple: false,
        onDropAccepted: jest.fn(),
        onDropRejected: jest.fn(),
        validation_error_message: null,
        onClickClose: jest.fn(),
        upload_message: 'upload here',
        value: [],
    };

    it('should render FileUploaderComponent component in desktop mode', async () => {
        render(<FileUploaderComponent {...props} />);
        expect(screen.getByText('upload here')).toBeInTheDocument();
    });

    it('should upload supported file', async () => {
        props.value = [file];
        render(<FileUploaderComponent {...props} />);
        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => {
            expect(input.files[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });
        expect(screen.getByText('hello.png')).toBeInTheDocument();
    });

    it('should show error message when unsupported file is uploaded', async () => {
        props.validation_error_message = 'error';
        render(<FileUploaderComponent {...props} />);

        const unsupported_file = new File(['hello'], 'hello.html', { type: 'html' });
        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [unsupported_file] } });

        await waitFor(() => {
            expect(screen.getByText('error')).toBeInTheDocument();
        });
    });
});
