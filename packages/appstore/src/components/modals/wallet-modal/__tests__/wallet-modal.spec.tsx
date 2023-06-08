import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletModal from '../wallet-modal';

jest.mock('../wallet-modal-header', () => jest.fn(() => <div>WalletModalHeader</div>));
jest.mock('../wallet-modal-body', () => jest.fn(() => <div>WalletModalBody</div>));

describe('WalletModal', () => {
    let modal_root_el;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    const mocked_store = mockStore({});

    it('Should render cashier modal if is_wallet_modal_visible is true', () => {
        mocked_store.ui.is_wallet_modal_visible = true;

        render(
            <StoreProvider store={mocked_store}>
                <WalletModal />
            </StoreProvider>
        );

        expect(screen.getByText('WalletModalHeader')).toBeInTheDocument();
        expect(screen.getByText('WalletModalBody')).toBeInTheDocument();
    });
});
