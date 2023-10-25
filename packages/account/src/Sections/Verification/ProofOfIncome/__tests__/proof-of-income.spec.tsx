import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WS } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import ProofOfIncome from 'Sections/Verification/ProofOfIncome';

const mocked_get_account_status = {
    authentication: {
        attempts: { latest: { service: '' }, history: [] },
        document: {
            status: 'none',
        },
        identity: {
            status: 'none',
            services: { idv: {}, onfido: {}, manual: {} },
        },
        income: {
            status: 'none',
        },
        needs_verification: [],
    },
    status: [],
};

jest.mock('Components/demo-message', () => jest.fn(() => 'MockedDemoMessage'));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        authorized: {
            getAccountStatus: jest.fn(() =>
                Promise.resolve({
                    get_account_status: { ...mocked_get_account_status },
                })
            ),
        },
        getSocket: jest.fn(() => Promise.resolve()),
    },
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Redirect: jest.fn(() => <div>Redirect</div>),
}));

describe('ProofOfIncome', () => {
    const files_descriptions_title = 'The document must be recent and include your name and address:';
    const files_descriptions = [
        'The document must be up-to-date and signed by the issuance authority.',
        'The document must contain a letterhead.',
        'Invalid or incomplete documents shall be rejected.',
    ];
    const upload_warning = 'Remember, selfies, pictures of houses, or non-related images will be rejected.';
    const file_type_requirements = 'Supported formats: JPEG, JPG, PNG, PDF, and GIF only';

    let mock_tore: ReturnType<typeof mockStore>;

    beforeEach(() => {
        mock_tore = mockStore({});
    });

    const componentTestRender = (mock_store: ReturnType<typeof mockStore>) => {
        render(<ProofOfIncome />, {
            wrapper: ({ children }) => <StoreProvider store={mock_store}>{children}</StoreProvider>,
        });
    };

    it('Should not render ProofOfIncome for demo account', () => {
        mock_tore.client.is_virtual = true;
        componentTestRender(mock_tore);

        expect(screen.getByText('MockedDemoMessage')).toBeInTheDocument();
    });
    it('Should redirect if ProofOfIncome is not required ', async () => {
        componentTestRender(mock_tore);
        expect(await screen.findByText('Redirect')).toBeInTheDocument();
    });
    it('Should render ProofOfIncome form when it is required', async () => {
        const mocked_get_account_status_for_poinc_required = {
            authentication: {
                attempts: { latest: { service: '' }, history: [] },
                document: {
                    status: 'none',
                },
                identity: {
                    status: 'none',
                    services: { idv: {}, onfido: {}, manual: {} },
                },
                income: {
                    status: 'none',
                },
                needs_verification: ['income'],
            },
            status: ['allow_document_upload', 'age_verification'],
        };
        (WS.authorized.getAccountStatus as jest.Mock).mockResolvedValue({
            get_account_status: {
                ...mocked_get_account_status_for_poinc_required,
            },
        });

        componentTestRender(mock_tore);
        expect(await screen.findByText(files_descriptions_title)).toBeInTheDocument();
        files_descriptions.forEach(description => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });

        const dropdown_input = screen.getByPlaceholderText('Select your document*') as HTMLInputElement;
        expect(dropdown_input).toBeVisible();
        expect(dropdown_input.value).toBe('');
        const file_input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        expect(file_input.value).toBe('');
        expect(screen.getByText(upload_warning)).toBeVisible();
        expect(screen.getByText(file_type_requirements)).toBeVisible();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Save and submit');
        expect(button).toBeDisabled();
    });
    it('Should render ProofOfIncome and upload the document successfully', async () => {
        const mocked_get_account_status_for_poinc_required = {
            authentication: {
                attempts: { latest: { service: '' }, history: [] },
                document: {
                    status: 'none',
                },
                identity: {
                    status: 'none',
                    services: { idv: {}, onfido: {}, manual: {} },
                },
                income: {
                    status: 'none',
                },
                needs_verification: ['income'],
            },
            status: ['allow_document_upload', 'age_verification'],
        };
        (WS.authorized.getAccountStatus as jest.Mock).mockResolvedValue({
            get_account_status: {
                ...mocked_get_account_status_for_poinc_required,
            },
        });

        componentTestRender(mock_tore);
        const dropdown_input = (await screen.findByPlaceholderText('Select your document*')) as HTMLInputElement;
        expect(dropdown_input).toBeVisible();
        expect(dropdown_input.value).toBe('');
        const file_input = screen.getByTestId('dt_file_upload_input') as HTMLInputElement;
        expect(file_input.value).toBe('');
        expect(screen.getByText(upload_warning)).toBeVisible();
        expect(screen.getByText(file_type_requirements)).toBeVisible();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Save and submit');
        expect(button).toBeDisabled();

        userEvent.type(dropdown_input, 'Tax return');
        await waitFor(() => {
            expect(dropdown_input.value).toBe('Tax return');
            expect(button).toBeDisabled();
        });

        const file = new File(['test document'], 'test_document.png', { type: 'image/png' });

        fireEvent.change(file_input, { target: { files: [file] } });

        await waitFor(() => {
            expect(file_input?.files?.[0]).toBe(file);
            expect(file_input.files).toHaveLength(1);
            expect(button).toBeEnabled();
        });
    });
});
