import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import FileUploaderComponent from '../file-uploader-component';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({ ui: { is_mobile: false } })}>{children}</StoreProvider>
);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    compressImageFiles: jest.fn(() => Promise.resolve([{ path: 'hello.pdf' }])),
    readFiles: jest.fn(),
}));

jest.mock('@binary-com/binary-document-uploader');

describe('<FileUploaderComponent />', () => {
    const file: File = new File(['hello'], 'hello.png', { type: 'image/png' });
    const props = {
        accept: 'image/pdf, image/png',
        filename_limit: 26,
        hover_message: 'hover here',
        max_size: 2097152,
        multiple: false,
        onDropAccepted: jest.fn(),
        onDropRejected: jest.fn(),
        validation_error_message: '',
        onClickClose: jest.fn(),
        upload_message: 'upload here',
        value: [] as File[],
    };

    it('should render FileUploaderComponent component in desktop mode', async () => {
        render(<FileUploaderComponent {...props} />, { wrapper });
        expect(screen.getByText('upload here')).toBeInTheDocument();
    });

    it('should upload supported file', async () => {
        props.value = [file];

        render(<FileUploaderComponent {...props} />, { wrapper });

        const input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            if (input.files) {
                expect(input.files[0]).toBe(file);
                expect(input.files).toHaveLength(1);
            }
        });

        expect(screen.getByText('hello.png')).toBeInTheDocument();
    });

    it('should show error message when unsupported file is uploaded', async () => {
        props.validation_error_message = 'error';

        render(<FileUploaderComponent {...props} />, { wrapper });

        const unsupported_file = new File(['hello'], 'hello.html', { type: 'html' });
        const input = screen.getByTestId('dt_file_upload_input');
        fireEvent.change(input, { target: { files: [unsupported_file] } });

        await waitFor(() => {
            expect(screen.getByText('error')).toBeInTheDocument();
        });
    });
});
