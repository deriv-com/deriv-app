import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletListHeader from '../WalletListHeader';
import '@testing-library/jest-dom';

jest.mock('../../../hooks/useDevice', () =>
    jest.fn(() => ({
        isMobile: false,
    }))
);

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: () => ({ data: { loginid: 'real1' } }),
    useWalletAccountsList: () => ({
        data: [
            { is_virtual: false, loginid: 'real1' },
            { is_virtual: true, loginid: 'demo123' },
        ],
    }),
}));

const mockSwitchWalletAccount = jest.fn();

jest.mock('../../../hooks/useWalletAccountSwitcher', () => ({
    __esModule: true,
    default: () => ({
        switchWalletAccount: mockSwitchWalletAccount,
    }),
}));

describe('WalletListHeader', () => {
    it('renders correctly', () => {
        render(<WalletListHeader />);
        expect(screen.getByText("Trader's Hub")).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should be checked if the demo account is active', () => {
        jest.mock('@deriv/api-v2', () => ({
            useActiveWalletAccount: () => ({ data: { loginid: 'demo123' } }),
            useWalletAccountsList: () => ({
                data: [
                    { is_virtual: false, loginid: 'real1' },
                    { is_virtual: true, loginid: 'demo123' },
                ],
            }),
        }));

        render(<WalletListHeader />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });
});
