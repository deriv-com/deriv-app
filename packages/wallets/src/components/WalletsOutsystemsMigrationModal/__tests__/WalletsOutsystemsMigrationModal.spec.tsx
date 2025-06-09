import React, { PropsWithChildren } from 'react';
import { APIProvider, useSettings } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import WalletsOustystemsMigrationModal from '../WalletsOutsystemsMigrationModal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('js-cookie', () => ({
    set: jest.fn(),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useSettings: jest.fn(),
}));

describe('WalletsOustystemsMigrationModal', () => {
    const updateMock = jest.fn();
    const wrapper = ({ children }: PropsWithChildren) => (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );

    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useSettings as jest.Mock).mockReturnValue({ update: updateMock });
        localStorage.clear();
        sessionStorage.clear();
    });

    it('renders modal content correctly', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<WalletsOustystemsMigrationModal />, { wrapper });

        expect(screen.getByText("Meet the new Trader's Hub")).toBeInTheDocument();
        expect(
            screen.getByText('Faster to use, easier navigation, better account management, same login details.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try it now' })).toBeInTheDocument();
    });

    it('redirects to Outsystems on button click', async () => {
        const account = 'USD';
        window.location.search = `?account=${account}`;
        const setItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        render(<WalletsOustystemsMigrationModal />, { wrapper });

        const button = screen.getByRole('button', { name: 'Try it now' });
        await userEvent.click(button);

        expect(setItemSpy).toHaveBeenCalledWith('redirect_to_th_os');
        expect(updateMock).toHaveBeenCalledWith({ feature_flag: { wallet: 1 } });
    });
});
