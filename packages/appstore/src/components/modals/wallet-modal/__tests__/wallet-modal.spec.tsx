import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletModal from '../wallet-modal';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn((name: string) => {
        if (name === 'authorize') {
            return {
                data: {
                    authorize: {
                        account_list: [
                            {
                                loginid: 'CRW000000',
                                account_category: 'wallet',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'USD',
                            },
                            {
                                loginid: 'MXN000000',
                                account_category: 'trading',
                                is_virtual: 0,
                                landing_company_name: 'maltainvest',
                                currency: 'BTC',
                            },
                        ],
                    },
                },
            };
        }

        return { data: undefined };
    }),
}));

jest.mock('../wallet-modal-header', () => jest.fn(() => <div>WalletModalHeader</div>));
jest.mock('../wallet-modal-body', () => jest.fn(() => <div>WalletModalBody</div>));

describe('WalletModal', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    const mocked_store = mockStore({
        client: {
            currency: 'USD',
            loginid: 'CRW000000',
            accounts: {
                CRW000000: {
                    token: 'token',
                },
            },
        },
    });

    it('Should render cashier modal if is_wallet_modal_visible is true', () => {
        mocked_store.ui.is_wallet_modal_visible = true;

        render(
            <APIProvider>
                <StoreProvider store={mocked_store}>
                    <WalletModal />
                </StoreProvider>
            </APIProvider>
        );

        expect(screen.getByText('WalletModalHeader')).toBeInTheDocument();
        expect(screen.getByText('WalletModalBody')).toBeInTheDocument();
    });
});
