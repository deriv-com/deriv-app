import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModalProvider } from '../../ModalProvider';
import WalletError from '../WalletError';
import { APIProvider } from '@deriv/api-v2';
import WalletsAuthProvider from '../../../AuthProvider';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isDesktop: true,
    })),
}));

const mockModalHide = jest.fn();
jest.mock('../../ModalProvider', () => ({
    ...jest.requireActual('../../ModalProvider'),
    useModal: jest.fn(() => ({
        ...jest.requireActual('../../ModalProvider').useModal(),
        hide: mockModalHide,
    })),
}));

describe('WalletError', () => {
    it('should show error message and the title', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <WalletError errorMessage='Error message' title='Something went wrong!' />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });

    it('should call hide modal when close button is clicked', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <ModalProvider>
                        <WalletError buttonText='Close' errorMessage='Error message' onClick={mockModalHide} />
                    </ModalProvider>
                </WalletsAuthProvider>
            </APIProvider>
        );
        const closeButton = screen.getByRole('button', { name: 'Close' });
        closeButton.click();
        expect(mockModalHide).toHaveBeenCalled();
    });
});
