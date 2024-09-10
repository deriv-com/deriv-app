import React from 'react';
import AccountTransferModal from '../account-transfer-modal';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@deriv/cashier/src/pages/account-transfer', () => jest.fn(() => <div>AccountTransfer</div>));

let modal_root_el: HTMLDivElement;
beforeAll(() => {
    modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

afterAll(() => {
    document.body.removeChild(modal_root_el);
});

describe('AccountTransferModal', () => {
    it('should render the modal', async () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    account_transfer: {
                        is_transfer_confirm: false,
                        should_switch_account: false,
                        error: '',
                    },
                    general_store: { setActiveTab: jest.fn() },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(
            <AccountTransferModal is_modal_open={true} toggleModal={mock.traders_hub.toggleAccountTransferModal} />,
            {
                wrapper,
            }
        );
        expect(container).toBeInTheDocument();
    });

    it('should render the text and mocked modal correctly', async () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    account_transfer: {
                        is_transfer_confirm: false,
                        should_switch_account: false,
                        error: '',
                    },
                    general_store: { setActiveTab: jest.fn() },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(
            <AccountTransferModal is_modal_open={true} toggleModal={mock.traders_hub.toggleAccountTransferModal} />,
            {
                wrapper,
            }
        );
        expect(screen.getByText('Transfer funds to your accounts')).toBeInTheDocument();
        expect(screen.getByText('AccountTransfer')).toBeInTheDocument();
    });

    it('should have account-transfer-modal classname if should switch account is true', async () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    account_transfer: {
                        is_transfer_confirm: false,
                        should_switch_account: true,
                        error: '',
                    },
                    general_store: { setActiveTab: jest.fn() },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(
            <AccountTransferModal is_modal_open={true} toggleModal={mock.traders_hub.toggleAccountTransferModal} />,
            {
                wrapper,
            }
        );
        expect(screen.getByText('Transfer funds to your accounts')).toBeInTheDocument();
        expect(screen.getByText('AccountTransfer')).toBeInTheDocument();
        expect(screen.getByText('Transfer funds to your accounts')).toHaveClass(
            'dc-modal-header__title--account-transfer-modal'
        );
    });

    it('should open error dialog when financial assessment error is present', async () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    account_transfer: {
                        is_transfer_confirm: false,
                        should_switch_account: true,
                        error: {
                            code: 'FinancialAssessmentRequired',
                            message: 'Please complete your financial assessment.',
                        },
                    },
                    general_store: { setActiveTab: jest.fn() },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>
                <MemoryRouter>{children}</MemoryRouter>
            </StoreProvider>
        );

        render(
            <AccountTransferModal is_modal_open={true} toggleModal={mock.traders_hub.toggleAccountTransferModal} />,
            {
                wrapper,
            }
        );

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
        expect(screen.getByText(/financial assessment/i)).toBeInTheDocument();
    });
});
