import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlowProvider } from '../../../../../components';
import useDevice from '../../../../../hooks/useDevice';
import DocumentSubmission from '../DocumentSubmission';

jest.mock('../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        ...jest.requireActual('../../../../../hooks/useDevice').default(),
        isMobile: false,
    })),
}));

const mockSetFormValues = jest.fn();
jest.mock('../../../../../components/FlowProvider', () => ({
    ...jest.requireActual('../../../../../components/FlowProvider'),
    useFlow: jest.fn(() => ({
        setFormValues: mockSetFormValues,
    })),
}));

describe('DocumentSubmission', () => {
    beforeAll(() => {
        global.URL.createObjectURL = jest.fn();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render document submission screen', () => {
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <div />,
                }}
            >
                {() => <DocumentSubmission />}
            </FlowProvider>
        );
        expect(screen.getByText('Document submission')).toBeInTheDocument();
        expect(
            screen.getByText(
                'We accept only these types of documents as proof of address. The document must be recent (issued within last 12 months) and include your name and address:'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Utility bill: electricity, water, gas, or landline phone bill.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Financial, legal, or government document: recent bank statement, affidavit, or government-issued letter.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Home rental agreement: valid and current agreement.')).toBeInTheDocument();
        expect(screen.getByText('Upload file')).toBeInTheDocument();
        expect(
            screen.getByText('Remember, selfies, pictures of houses, or non-related images will be rejected.')
        ).toBeInTheDocument();
        expect(screen.getByText('Drag and drop a file or click to browse your files.')).toBeInTheDocument();
        expect(screen.getByText('Supported formats : JPEG, JPG, PNG, PDF, and GIF only')).toBeInTheDocument();
        expect(screen.getByText('Maximum size : 8MB')).toBeInTheDocument();
        expect(screen.getByText('Common mistakes')).toBeInTheDocument();
        expect(screen.getByText('Name in document doesn’t match your Deriv profile.')).toBeInTheDocument();
        expect(screen.getByText('Address in document doesn’t match address you entered above.')).toBeInTheDocument();
        expect(screen.getByText('Document issued more than 12-months ago.')).toBeInTheDocument();
        expect(screen.getByText('Blurry document. All information must be clear and visible.')).toBeInTheDocument();
        expect(screen.getByText('Cropped document. All information must be clear and visible.')).toBeInTheDocument();
        expect(screen.getByText('An envelope with your name and address.')).toBeInTheDocument();
    });

    it('should be able to upload document', async () => {
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <div />,
                }}
            >
                {() => <DocumentSubmission />}
            </FlowProvider>
        );

        const document = new File(['foo'], 'foo.jpeg', { type: 'image/jpeg' });
        const input: HTMLInputElement = screen.getByTestId('dt_dropzone-input');

        await waitFor(() => {
            userEvent.upload(input, document);
        });

        expect(input.files).toHaveLength(1);
        expect(mockSetFormValues).toBeCalledWith('poaDocument', document);
    });

    it('should show particular texts with the correct size in mobile view', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({
            isMobile: true,
        }));
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <div />,
                }}
            >
                {() => <DocumentSubmission />}
            </FlowProvider>
        );

        expect(screen.getByText('Supported formats : JPEG, JPG, PNG, PDF, and GIF only')).toHaveClass(
            'wallets-text__size--xs'
        );
        expect(screen.getByText('Maximum size : 8MB')).toHaveClass('wallets-text__size--xs');
    });
});
