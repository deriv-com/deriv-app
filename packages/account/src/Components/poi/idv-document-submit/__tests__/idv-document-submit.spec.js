import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { isDesktop, isMobile } from '@deriv/shared';
import IdvDocumentSubmit from '../idv-document-submit';
import { isSequentialNumber, isRecurringNumberRegex } from '../utils';

jest.mock('react-router');
jest.mock('Assets/ic-document-submit-icon.svg', () => jest.fn(() => 'DocumentSubmitLogo'));
jest.mock('../../../hooks/useToggleValidation', () => ({
    useToggleValidation: jest.fn(() => '#toggle_id_validation'),
}));
jest.mock('../utils.js', () => ({
    getDocumentData: function (country_code, key) {
        const data = {
            tc: {
                document_1: {
                    new_display_name: '',
                    example_format: '5436454364243',
                    sample_image: '',
                },
                document_2: {
                    new_display_name: '',
                    example_format: 'A-52431',
                    sample_image: '',
                },
            },
        };
        return data[country_code][key];
    },
    getRegex: jest.fn(() => /5436454364243/i),
    isSequentialNumber: jest.fn(() => false),
    isRecurringNumberRegex: jest.fn(() => false),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    formatInput: jest.fn(() => '5436454364243'),
    WS: {
        send: jest.fn(() => Promise.resolve({ error: '' })),
    },
}));

describe('<IdvDocumentSubmit/>', () => {
    const mock_props = {
        handleBack: jest.fn(),
        handleViewComplete: jest.fn(),
        selected_country: {
            value: 'tc',
            text: 'Test country',
            identity: {
                services: {
                    idv: {
                        documents_supported: {
                            document_1: { display_name: 'Test document 1 name', format: '5436454364243' },
                            document_2: { display_name: 'Test document 2 name', format: 'A54321' },
                        },
                        has_visual_sample: 1,
                        is_country_supported: 0,
                    },
                },
            },
        },
        is_from_external: false,
    };

    it('should render IdvDocumentSubmit component', () => {
        render(<IdvDocumentSubmit {...mock_props} />);

        expect(screen.getByText(/verify your identity/i)).toBeInTheDocument();
        expect(screen.getByText(/Please select the document type and enter the ID number/i)).toBeInTheDocument();
        expect(screen.getByText('DocumentSubmitLogo')).toBeInTheDocument();
        expect(screen.queryByText('New ID type name')).not.toBeInTheDocument();
        expect(screen.queryByText('Please select a document type.')).not.toBeInTheDocument();

        const inputs = screen.getAllByRole('textbox');
        expect(inputs.length).toBe(2);
        expect(inputs[0].name).toBe('document_type');
        expect(inputs[1].name).toBe('document_number');
    });

    it('should  trigger "go back" button, inputs and check document_type validation after rendering IdvDocumentSubmit component', async () => {
        render(<IdvDocumentSubmit {...mock_props} />);

        const backBtn = screen.getByRole('button', { name: /go back/i });
        fireEvent.click(backBtn);
        expect(mock_props.handleBack).toHaveBeenCalledTimes(1);

        const document_type_input = screen.getByLabelText('Choose the document type');
        const document_number_input = screen.getByPlaceholderText('Enter your document number');
        expect(document_number_input).toBeDisabled();
        expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
        expect(screen.queryByText('Test document 2 name')).not.toBeInTheDocument();

        fireEvent.click(document_type_input);
        expect(await screen.findByText('Test document 1 name')).toBeInTheDocument();
        expect(await screen.findByText('Test document 2 name')).toBeInTheDocument();
        expect(screen.queryByText('Please select a document type.')).not.toBeInTheDocument();

        fireEvent.blur(document_type_input);
        expect(await screen.findByText('Please select a document type.')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByText('Test document 1 name')).not.toBeInTheDocument();
            expect(screen.queryByText('Test document 2 name')).not.toBeInTheDocument();
        });
    });

    it('should not allow users to fill in repetitive document numbers', async () => {
        //invalid document number- error should be shown
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);
        isSequentialNumber.mockReturnValue(true);
        isRecurringNumberRegex.mockReturnValue(true);

        const selected_doc_msg =
            'Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to account settings.';

        render(<IdvDocumentSubmit {...mock_props} />);

        const verifyBtn = screen.getByRole('button', { name: /verify/i });
        expect(verifyBtn).toBeDisabled();

        const document_type_input = screen.getByRole('combobox');
        expect(document_type_input.name).toBe('document_type');
        const document_number_input = screen.getByPlaceholderText('Enter your document number');
        expect(document_number_input.name).toBe('document_number');
        expect(document_number_input).toBeDisabled();
        expect(screen.queryByText(selected_doc_msg)).not.toBeInTheDocument();

        fireEvent.change(document_type_input, { target: { value: 'Test document 2 name' } });
        expect(document_number_input).not.toBeDisabled();
        expect(screen.getByText(selected_doc_msg)).toBeInTheDocument();

        fireEvent.blur(document_number_input);
        expect(await screen.findByText(/please enter your document number/i)).toBeInTheDocument();

        Object.defineProperty(window, 'location', {
            get() {
                return { hash: '#toggle_id_validation' };
            },
        });

        fireEvent.keyUp(document_number_input);
        fireEvent.change(document_number_input, { target: { value: 'A-54321' } });
        expect(await screen.findByText(/please enter a valid ID number/i)).toBeInTheDocument();

        fireEvent.change(document_number_input, { target: { value: '111112' } });
        expect(await screen.findByText(/please enter a valid ID number/i)).toBeInTheDocument();
    });

    it('should change inputs, check document_number validation and trigger "Verify" button after rendering IdvDocumentSubmit component', async () => {
        isDesktop.mockReturnValue(false);
        isMobile.mockReturnValue(true);
        isSequentialNumber.mockReturnValue(false);
        isRecurringNumberRegex.mockReturnValue(false);

        const selected_doc_msg =
            'Please ensure all your personal details are the same as in your chosen document. If you wish to update your personal details, go to account settings.';

        render(<IdvDocumentSubmit {...mock_props} />);

        const verifyBtn = screen.getByRole('button', { name: /verify/i });
        expect(verifyBtn).toBeDisabled();

        const document_type_input = screen.getByRole('combobox');
        expect(document_type_input.name).toBe('document_type');
        const document_number_input = screen.getByPlaceholderText('Enter your document number');
        expect(document_number_input.name).toBe('document_number');
        expect(document_number_input).toBeDisabled();
        expect(screen.queryByText(selected_doc_msg)).not.toBeInTheDocument();

        fireEvent.change(document_type_input, { target: { value: 'Test document 2 name' } });
        expect(document_number_input).not.toBeDisabled();
        expect(screen.getByText(selected_doc_msg)).toBeInTheDocument();
        expect(screen.queryByText(/please enter the correct format/i)).not.toBeInTheDocument();

        fireEvent.blur(document_number_input);
        expect(await screen.findByText(/please enter your document number/i)).toBeInTheDocument();

        fireEvent.keyUp(document_number_input);
        fireEvent.change(document_number_input, { target: { value: 'A-32523' } });
        expect(await screen.findByText(/please enter the correct format/i)).toBeInTheDocument();

        fireEvent.change(document_number_input, { target: { value: '5436454364243' } });
        await waitFor(() => {
            expect(screen.queryByText(/please enter the correct format/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/please enter a valid ID number/i)).not.toBeInTheDocument();
            expect(verifyBtn).not.toBeDisabled();
        });

        fireEvent.click(verifyBtn);
        await waitFor(() => {
            expect(mock_props.handleViewComplete).toHaveBeenCalledTimes(1);
        });
    });
});
