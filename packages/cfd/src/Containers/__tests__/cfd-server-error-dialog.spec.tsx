import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import CFDServerErrorDialog from '../cfd-server-error-dialog';
import CFDProviders from '../../cfd-providers';

describe('<CFDServerErrorDialog /> ', () => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);

    let mock_root_store;
    beforeEach(() => {
        mock_root_store = {
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
                    error_message: 'This is a sample error message',
                },
            },
        };
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render the component properly', () => {
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_root_store)}>{children}</CFDProviders>,
        });

        const dialog_wrapper = screen.getByRole('dialog');
        expect(dialog_wrapper).toHaveClass('dc-dialog__dialog');

        const dialog_content = screen.getByText(/This is a sample error message/i);
        expect(dialog_content).toHaveClass('dc-dialog__content');

        const ok_button = screen.getByRole('button', { name: /OK/i });
        expect(ok_button).toHaveClass('dc-btn', 'dc-btn__effect', 'dc-dialog__button');

        const dialog_title = screen.getByRole('heading', { name: /Something’s not right/i });
        expect(dialog_title).toHaveClass('dc-dialog__header--title');
    });

    it('should render the proper text and error message', () => {
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_root_store)}>{children}</CFDProviders>,
        });

        expect(screen.getByText(/This is a sample error message/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('OK');
        expect(screen.getByRole('heading')).toHaveTextContent(/Something’s not right/i);
    });

    it('should not render the component if has_cfd_error is false', () => {
        const new_mock_root_store = {
            ui: {
                ...mock_root_store.ui,
            },
            modules: {
                cfd: {
                    ...mock_root_store.modules.cfd,
                    has_cfd_error: false,
                },
            },
        };
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(new_mock_root_store)}>{children}</CFDProviders>,
        });

        expect(screen.queryByText(/This is a sample error message/i)).not.toBeInTheDocument();
    });

    it('should not render the component if is_cfd_success_dialog_enabled', () => {
        const new_mock_root_store = {
            ui: {
                ...mock_root_store.ui,
            },
            modules: {
                cfd: {
                    ...mock_root_store.modules.cfd,
                    is_cfd_success_dialog_enabled: true,
                },
            },
        };

        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(new_mock_root_store)}>{children}</CFDProviders>,
        });

        expect(screen.queryByText(/This is a sample error message/i)).not.toBeInTheDocument();
    });

    it('should clear the component if OK is clicked', () => {
        render(<CFDServerErrorDialog />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_root_store)}>{children}</CFDProviders>,
        });

        const ok_btn = screen.getByRole('button', { name: /OK/i });
        fireEvent.click(ok_btn);

        expect(mock_root_store.modules.cfd.clearCFDError).toHaveBeenCalled();
    });
});
