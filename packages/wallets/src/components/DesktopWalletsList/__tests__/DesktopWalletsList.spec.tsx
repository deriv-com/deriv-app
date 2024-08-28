import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import DesktopWalletsList from '../DesktopWalletsList';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
}));

const wrapper = ({ children }: PropsWithChildren) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

describe('DesktopWalletsList', () => {
    it('renders the component', () => {
        const mockUseActiveWalletAccount = {
            isInitializing: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue(mockUseActiveWalletAccount);
        render(<DesktopWalletsList />, { wrapper });
        expect(screen.getByTestId('dt_desktop-wallets-list')).toBeInTheDocument();
    });
    it('renders the component when authorization is not initializing', () => {
        const mockUseActiveWalletAccount = {
            data: {
                is_active: true,
                is_virtual: false,
                loginid: 'CRW1',
            },
            isInitializing: false,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue(mockUseActiveWalletAccount);

        render(<DesktopWalletsList />, { wrapper });
        expect(screen.getByTestId('dt_wallets_container')).toBeInTheDocument();
    });
    it('displays loader while authorization is initializing', () => {
        const mockUseActiveWalletAccount = {
            isInitializing: true,
        };
        (useActiveWalletAccount as jest.Mock).mockReturnValue(mockUseActiveWalletAccount);

        render(<DesktopWalletsList />, { wrapper });
        expect(screen.getByTestId('dt_wallets_card_loader')).toBeInTheDocument();
    });
});
