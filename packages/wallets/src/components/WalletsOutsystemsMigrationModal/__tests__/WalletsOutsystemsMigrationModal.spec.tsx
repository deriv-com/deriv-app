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

        expect(screen.getByText('New look, same Deriv')).toBeInTheDocument();
        expect(
            screen.getByText(
                "We've polished up the page to serve you better. Same account, same details—just easier to use."
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Take me there' })).toBeInTheDocument();
    });

    it('redirects to Outsystems on button click', async () => {
        const account = 'USD';
        window.location.search = `?account=${account}`;
        const setItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

        render(<WalletsOustystemsMigrationModal />, { wrapper });

        const button = screen.getByRole('button', { name: 'Take me there' });
        await userEvent.click(button);

        expect(setItemSpy).toHaveBeenCalledWith('redirect_to_th_os');
        expect(updateMock).toHaveBeenCalledWith({ feature_flag: { wallet: 1 } });
    });
});
