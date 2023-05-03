import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import CashierWalletModal from '../cashier-wallet-modal';

jest.mock('../cashier-wallet-modal-header', () => jest.fn(() => <div>CashierWalletModalHeader</div>));
jest.mock('../cashier-wallet-modal-body', () => {
    const { forwardRef } = jest.requireActual('react');
    return {
        __esModule: true,
        default: forwardRef(() => <div>CashierWalletModalBody</div>),
    };
});

describe('CashierWalletModal', () => {
    let modal_root_el;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    const mocked_store = mockStore({});

    it('Should render cashier modal if is_cashier_wallet_modal_visible is true', () => {
        mocked_store.ui.is_cashier_wallet_modal_visible = true;

        render(
            <StoreProvider store={mocked_store}>
                <CashierWalletModal />
            </StoreProvider>
        );

        expect(screen.getByText('CashierWalletModalHeader')).toBeInTheDocument();
        expect(screen.getByText('CashierWalletModalBody')).toBeInTheDocument();
    });
});
