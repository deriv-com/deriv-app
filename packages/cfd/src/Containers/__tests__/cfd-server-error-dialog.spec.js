import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StoreProvider } from '@deriv/stores';
import CFDServerErrorDialog from '../cfd-server-error-dialog';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CFDServerErrorDialog /> ', () => {
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component properly', () => {
        const mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            modules: {
                cfd: {
                    clearCFDError: jest.fn(),
                    error_type: 'error_type',
                    has_cfd_error: true,
                    is_cfd_success_dialog_enabled: false,
                    error_message: 'Sorry, an error occured while processing your request.',
                },
            },
        };

        const { container } = render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(container.firstChild).toHaveClass('dc-dialog__wrapper dc-dialog__wrapper--enter');
    });

    it('should render the proper text and error message', () => {
        const mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            modules: {
                cfd: {
                    clearCFDError: jest.fn(),
                    error_type: 'error_type',
                    has_cfd_error: true,
                    is_cfd_success_dialog_enabled: false,
                    error_message: 'Sorry, an error occured while processing your request.',
                },
            },
        };

        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.getByText(/Sorry, an error occured while processing your request/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('OK');
        expect(screen.getByRole('heading')).toHaveTextContent(/Something’s not right/i);
    });

    it('should not render the component if has_cfd_error is false', () => {
        const mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            modules: {
                cfd: {
                    clearCFDError: jest.fn(),
                    error_type: 'error_type',
                    has_cfd_error: false,
                    is_cfd_success_dialog_enabled: false,
                    error_message: 'Sorry, an error occured while processing your request.',
                },
            },
        };

        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.queryByText(/Sorry, an error occured while processing your request/i)).not.toBeInTheDocument();
    });

    it('should not render the component if is_cfd_success_dialog_enabled', () => {
        const mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            modules: {
                cfd: {
                    clearCFDError: jest.fn(),
                    error_type: 'error_type',
                    has_cfd_error: false,
                    is_cfd_success_dialog_enabled: true,
                    error_message: 'Sorry, an error occured while processing your request.',
                },
            },
        };

        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        expect(screen.queryByText(/Sorry, an error occured while processing your request/i)).not.toBeInTheDocument();
    });

    it('should clear the component if OK is clicked', () => {
        const mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            modules: {
                cfd: {
                    clearCFDError: jest.fn(),
                    error_type: 'error_type',
                    has_cfd_error: true,
                    is_cfd_success_dialog_enabled: false,
                    error_message: 'Sorry, an error occured while processing your request.',
                },
            },
        };

        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const ok_btn = screen.getByRole('button', { name: /OK/i });
        fireEvent.click(ok_btn);

        expect(mockRootStore.modules.cfd.clearCFDError).toHaveBeenCalled();
    });
});
