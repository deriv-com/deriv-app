import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveWalletAccount, useIsEuRegion } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import DesktopWalletsList from '../DesktopWalletsList';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useIsEuRegion: jest.fn(() => ({
        data: false,
        isLoading: false,
    })),
}));

jest.mock('../../AccountsList', () => ({
    AccountsList: () => <div>Accounts List</div>,
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
    it('applies the with-banner class when is_eu is true and is_virtual is false', () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: true,
            isLoading: false,
        });
        (useActiveWalletAccount as jest.Mock).mockReturnValue(() => ({ is_vertual: false }));
        render(<DesktopWalletsList />, { wrapper });
        expect(screen.getByTestId('dt_desktop-wallets-list')).toHaveClass('wallets-desktop-wallets-list--with-banner');
    });
});
