import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CompareAccountsModal from '../compare-accounts-modal';
import CFDProviders from '../../cfd-providers';
import { mockStore } from '@deriv/stores';

jest.mock('../mt5-compare-table-content', () => jest.fn(() => 'MockedMt5CompareTableContent'));

describe('CompareAccountsModal', () => {
    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    let mock_props;
    beforeEach(() => {
        mock_props = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
                openDerivRealAccountNeededModal: jest.fn(),
            },
            modules: {
                cfd: {
                    is_compare_accounts_visible: true,
                    toggleCompareAccountsModal: jest.fn(),
                    openPasswordModal: jest.fn(),
                },
            },
            client: {
                is_populating_mt5_account_list: false,
                is_logged_in: true,
                is_eu: false,
                is_uk: false,
                residence: 'id',
            },
            is_real_enabled: true,
            platform: 'mt5',
            is_demo_tab: true,
        };
    });
    it('should render the modal', async () => {
        render(<CompareAccountsModal {...mock_props} />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_props)}>{children}</CFDProviders>,
        });
        await waitFor(() => {
            expect(screen.getByText(/compare available accounts/i)).toBeInTheDocument();
        });
    });
    it('should render the MockedMT5CompareTableContent for mt5', async () => {
        render(<CompareAccountsModal {...mock_props} />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_props)}>{children}</CFDProviders>,
        });
        await waitFor(() => {
            expect(screen.getByText(/compare available accounts/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/MockedMt5CompareTableContent/i)).toBeInTheDocument();
    });
    it('should render the CompareAccountsModal if the platform is dxtrade', async () => {
        render(<CompareAccountsModal {...mock_props} platform='dxtrade' />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_props)}>{children}</CFDProviders>,
        });
        await waitFor(() => {
            expect(screen.getAllByText(/account information/i)[0]).toBeInTheDocument();
        });
        expect(screen.getAllByText(/maximum leverage/i)[0]).toBeInTheDocument();
    });
    it('should render the MockedMt5CompareTableContent if the user is not logged in', async () => {
        render(<CompareAccountsModal {...mock_props} is_logged_in={false} />, {
            wrapper: ({ children }) => <CFDProviders store={mockStore(mock_props)}>{children}</CFDProviders>,
        });
        await waitFor(() => {
            expect(screen.getByText(/compare available accounts/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/MockedMt5CompareTableContent/i)).toBeInTheDocument();
    });
    it('should call toggleCompareAccountsModal if the compare accounts button is clicked', async () => {
        render(<CompareAccountsModal {...mock_props} is_demo_tab={false} platform='dxtrade' />, {
            wrapper: ({ children }) => (
                <CFDProviders
                    store={mockStore({
                        ...mock_props,
                        modules: { cfd: { ...mock_props.modules.cfd, is_compare_accounts_visible: false } },
                    })}
                >
                    {children}
                </CFDProviders>
            ),
        });
        await waitFor(() => {
            expect(screen.getAllByText(/account information/i)[0]).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText(/account information/i));
        expect(mock_props.modules.cfd.toggleCompareAccountsModal).toHaveBeenCalled();
    });
});
