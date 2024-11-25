import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '../../../../../components/ModalProvider';
import TradingPlatformStatus from '../TradingPlatformStatus';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const mockHide = jest.fn();
jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../../../../components/ModalProvider').useModal(),
        hide: mockHide,
    })),
}));

describe('TradingPlatformStatus', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    it('renders default content for maintenance status', () => {
        render(
            <ModalProvider>
                <TradingPlatformStatus status='under_maintenance' />
            </ModalProvider>
        );

        expect(screen.getByText('Server Maintenance')).toBeInTheDocument();
        expect(
            screen.getByText('We’re currently performing server maintenance. Service may be affected.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('renders default content for unavailable status', () => {
        render(
            <ModalProvider>
                <TradingPlatformStatus status='unavailable' />
            </ModalProvider>
        );

        expect(screen.getByText('Account Unavailable')).toBeInTheDocument();
        expect(
            screen.getByText('The server is temporarily unavailable for this account. We’re working to resolve this.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    });

    it('calls hide when clicking on OK button', async () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });
        render(
            <ModalProvider>
                <TradingPlatformStatus status='under_maintenance' />
            </ModalProvider>
        );

        await userEvent.click(screen.getByRole('button', { name: 'OK' }));
        expect(mockHide).toHaveBeenCalled();
    });
});
