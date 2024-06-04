import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropzone from '../Dropzone';

describe('Dropzone', () => {
    const textPlainText = 'text/plain';
    const dropZoneInputTestId = 'dt_dropzone_input';

    beforeAll(() => {
        global.URL.createObjectURL = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should open file explorer when clicking on the button', async () => {
        const file = new File(['foo'], 'foo.txt', { type: textPlainText });
        render(<Dropzone buttonText='Find file' icon={<i data-testid='dt_dropzone_icon'>icon</i>} />);
        const input: HTMLInputElement = screen.getByTestId(dropZoneInputTestId);
        await waitFor(() => {
            userEvent.upload(input, file);
        });
        expect(input.files).toHaveLength(1);
    });

    it('should remove file when clicking on the remove button', () => {
        render(
            <Dropzone
                buttonText='Find file'
                defaultFile={new File([''], 'filename')}
                icon={<i data-testid='dt_dropzone_icon'>icon</i>}
            />
        );
        const removeButton = screen.getByTestId('dt_remove_button');
        removeButton.click();
        expect(screen.queryByText('filename')).not.toBeInTheDocument();
    });

    it('should show error message if file type is invalid', async () => {
        const file = new File(['foo'], 'foo.txt', { type: textPlainText });
        render(
            <Dropzone
                buttonText='Find file'
                fileFormats={'images/*'}
                icon={<i data-testid='dt_dropzone_icon'>icon</i>}
            />
        );
        const input = screen.getByTestId(dropZoneInputTestId);
        await waitFor(() => {
            userEvent.upload(input, file);
        });
        expect(screen.getByText('File type must be images/*')).toBeInTheDocument();
    });

    it('should call onFileChange when file is changed', async () => {
        const file = new File(['foo'], 'foo.txt', { type: textPlainText });
        const onFileChange = jest.fn();
        render(
            <Dropzone
                buttonText='Find file'
                defaultFile={file}
                icon={<i data-testid='dt_dropzone_icon'>icon</i>}
                onFileChange={onFileChange}
            />
        );
        const input = screen.getByTestId(dropZoneInputTestId);
        await waitFor(() => {
            userEvent.upload(input, file);
        });
        expect(onFileChange).toHaveBeenCalled();
    });

    it('should show error message if file size is invalid', async () => {
        const file = new File(['foo'], 'foo.txt', { type: textPlainText });
        render(<Dropzone buttonText='Find file' icon={<i data-testid='dt_dropzone_icon'>icon</i>} maxSize={1} />);
        const input = screen.getByTestId(dropZoneInputTestId);
        await waitFor(() => {
            userEvent.upload(input, file);
        });
        expect(screen.getByText('File is larger than 1 bytes')).toBeInTheDocument();
    });

    it('should show hover message when dragging the file', async () => {
        const file = new File(['foo'], 'foo.txt', { type: textPlainText });
        render(<Dropzone buttonText='Find file' icon={<i data-testid='dt_dropzone_icon'>icon</i>} />);
        const input: HTMLInputElement = screen.getByTestId(dropZoneInputTestId);
        await waitFor(() => {
            Object.defineProperty(input, 'files', {
                value: [file],
            });
            fireEvent.dragEnter(input);
            fireEvent.dragLeave(input);
        });
        expect(screen.getByText('Drop file here')).toBeInTheDocument();
    });

    it('should be able to drop the file', async () => {
        const file = new File(['foo'], 'foo.txt', { type: textPlainText });
        render(<Dropzone buttonText='Find file' icon={<i data-testid='dt_dropzone_icon'>icon</i>} />);
        const input: HTMLInputElement = screen.getByTestId(dropZoneInputTestId);
        await waitFor(() => {
            Object.defineProperty(input, 'files', {
                value: [file],
            });
            fireEvent.drop(input);
        });

        expect(input.files).toHaveLength(1);
    });
});
