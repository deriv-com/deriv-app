import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import WalletModal from '../wallet-modal';
import { useActiveWallet } from '@deriv/hooks';
import { APIProvider } from '@deriv/api';

jest.mock('../wallet-modal-header', () => jest.fn(() => <div>WalletModalHeader</div>));
jest.mock('../wallet-modal-body', () => jest.fn(() => <div>WalletModalBody</div>));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useActiveWallet: jest.fn(),
}));

const mockUseActiveWallet = useActiveWallet as jest.MockedFunction<typeof useActiveWallet>;

describe('WalletModal', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    it('Should render cashier modal if is_wallet_modal_visible is true', () => {
        const mocked_store = mockStore({
            ui: { is_wallet_modal_visible: true },
            client: { is_authorize: true },
            traders_hub: { active_modal_wallet_id: 'CRW000000' },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseActiveWallet.mockReturnValue({ loginid: 'CRW000000', is_demo: false });

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

    it('Should not render cashier modal and show loader if authorize is false', () => {
        const mocked_store = mockStore({
            ui: { is_wallet_modal_visible: true },
            client: { is_authorize: false },
            traders_hub: { active_modal_wallet_id: 'CRW000000' },
        });

        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseActiveWallet.mockReturnValue({ loginid: 'CRW100000', is_demo: false });

        render(
            <StoreProvider store={mocked_store}>
                <WalletModal />
            </StoreProvider>
        );

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });
});
