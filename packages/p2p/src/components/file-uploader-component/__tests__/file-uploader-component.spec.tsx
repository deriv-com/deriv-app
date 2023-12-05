import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import FileUploaderComponent from '../file-uploader-component';

describe('<FileUploaderComponent />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const props = {
        accept: 'image/pdf, image/png',
        filename_limit: 26,
        hover_message: 'drop here',
        max_size: 2097152,
        multiple: false,
        setDocumentFile: jest.fn(),
        validation_error_message: null,
        upload_message: 'upload here',
        value: [],
    };

    it('should render FileUploaderComponent component in desktop mode', async () => {
        render(<FileUploaderComponent {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        expect(screen.getByText('upload here')).toBeInTheDocument();
    });

    it('should upload supported file', async () => {
        const new_props = {
            ...props,
            value: [file],
        };
        render(<FileUploaderComponent {...new_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });
        const input: HTMLInputElement = screen.getByTestId('dt_file_upload_input');
        userEvent.upload(input, file);
        await waitFor(() => {
            expect(input.files?.[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });
        expect(props.setDocumentFile).toHaveBeenCalledWith({ files: [file], error_message: null });
        expect(screen.getByText('hello.png')).toBeInTheDocument();
    });

    it('should show error message when unsupported file is uploaded', async () => {
        const new_props = { ...props, validation_error_message: 'error' };
        render(<FileUploaderComponent {...new_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const unsupported_file = new File(['hello'], 'hello.html', { type: 'html' });
        const input = screen.getByTestId('dt_file_upload_input');
        userEvent.upload(input, unsupported_file);

        await waitFor(() => {
            expect(screen.getByText('error')).toBeInTheDocument();
        });
    });
    it('should handle remove File', async () => {
        const new_props = { ...props, validation_error_message: 'error' };
        render(<FileUploaderComponent {...new_props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockStore({})}>{children}</StoreProvider>,
        });

        const input: HTMLInputElement = screen.getByTestId('dt_file_upload_input');
        userEvent.upload(input, file);
        await waitFor(() => {
            expect(input.files?.[0]).toBe(file);
            expect(input.files).toHaveLength(1);
        });
        const remove_icon = screen.getByTestId('dt_remove_file_icon');
        expect(remove_icon).toBeInTheDocument();
        userEvent.click(remove_icon);
        expect(props.setDocumentFile).toHaveBeenCalledWith({ files: [], error_message: null });
    });
});
