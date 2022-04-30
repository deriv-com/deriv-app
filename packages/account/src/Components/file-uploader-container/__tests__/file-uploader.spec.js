import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { compressImageFiles, isMobile, isDesktop, readFiles } from '@deriv/shared';
import FileUploader from '../file-uploader';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    compressImageFiles: jest.fn(() => Promise.resolve([{ path: 'hello.pdf' }])),
    readFiles: jest.fn(),
}));

jest.mock('@binary-com/binary-document-uploader');

describe('<FileUploader />', () => {
    const props = {
        onFileDrop: jest.fn(),
        getSocket: jest.fn(),
        ref: React.createRef(),
    };
    it('should render FileUploader component in desktop mode', () => {
        const tree = render(<FileUploader {...props} />);
        expect(tree).toMatchSnapshot();
    });

    it('should render FileUploader component in mobile mode', () => {
        isMobile.mockReturnValue(true);
        isDesktop.mockReturnValue(false);
        const tree = render(<FileUploader {...props} />);
        expect(tree).toMatchSnapshot();
    });

    it('should upload supported file', async () => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        render(<FileUploader {...props} />);

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = screen.getByTestId('file_upload_input');
        await waitFor(() =>
            fireEvent.change(input, {
                target: { files: [file] },
            })
        );

        expect(input.files[0]).toBe(file);
        expect(input.files).toHaveLength(1);
    });
    it('should show error message when unsupported file is uploaded', async () => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        const tree = render(<FileUploader {...props} />);

        const file = new File(['hello'], 'hello.html', { type: 'html' });
        const input = screen.getByTestId('file_upload_input');
        await waitFor(() =>
            fireEvent.change(input, {
                target: { files: [file] },
            })
        );
        expect(tree).toMatchSnapshot();
    });

    it('should show error message when multiple files are uploaded', async () => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        const tree = render(<FileUploader {...props} />);

        const files = [
            new File(['hello'], 'hello.png', { type: 'image/png' }),
            new File(['there'], 'there.png', { type: 'image/png' }),
        ];
        const input = screen.getByTestId('file_upload_input');
        await waitFor(() =>
            fireEvent.change(input, {
                target: { files: [files] },
            })
        );
        expect(tree).toMatchSnapshot();
    });

    it('should show error message when larger files are uploaded', async () => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        const tree = render(<FileUploader {...props} />);
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        Object.defineProperty(file, 'size', { value: 1024 * 1024 * 10 });

        const input = screen.getByTestId('file_upload_input');
        await waitFor(() =>
            fireEvent.change(input, {
                target: { files: [file] },
            })
        );
        expect(tree).toMatchSnapshot();
    });

    it('should remove the file when close icon is clicked', async () => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        render(<FileUploader {...props} />);
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = screen.getByTestId('file_upload_input');
        await waitFor(() =>
            fireEvent.change(input, {
                target: { files: [file] },
            })
        );
        expect(screen.getByText(/hello\.png/i)).toBeInTheDocument();
        expect(input.files[0]).toBe(file);
        expect(input.files).toHaveLength(1);

        const close_icon = screen.getByTestId('removeFileIcon');
        expect(close_icon).toBeInTheDocument();
        await waitFor(() => fireEvent.click(close_icon));

        expect(screen.queryByText(/hello\.png/i)).not.toBeInTheDocument();
    });

    it('upload function should return 0 if document is not selected', () => {
        render(<FileUploader {...props} />);

        const uploadFn = props.ref.current.upload();
        expect(uploadFn).toBe(0);
    });

    it('upload methods should reject if readFile returns empty array ', async () => {
        isDesktop.mockReturnValue(true);
        isMobile.mockReturnValue(false);
        readFiles.mockResolvedValue([]);

        render(<FileUploader {...props} />);
        const blob = new Blob(['sample_data']);
        const file = new File([blob], 'hello.pdf', { type: 'application/pdf' });

        const input = screen.getByTestId('file_upload_input');

        await waitFor(() =>
            fireEvent.change(input, {
                target: { files: [file] },
            })
        );

        expect(screen.getByText(/hello\.pdf/i)).toBeInTheDocument();
        expect(input.files[0]).toBe(file);
        props.ref.current.upload();
        expect(compressImageFiles).toBeCalled();
        expect(props.onFileDrop).toBeCalled();
    });
});
