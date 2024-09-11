import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { fireEvent, render, screen } from '@testing-library/react';
import WalletListHeader from '../WalletListHeader';
import '@testing-library/jest-dom';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: () => ({ data: { is_virtual: false, loginid: 'real1' } }),
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
    default: jest.fn(() => mockSwitchWalletAccount),
}));

describe('WalletListHeader', () => {
    beforeEach(() => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render header correctly', () => {
        render(<WalletListHeader />);

        expect(screen.getByText("Trader's Hub")).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('should be checked if the real account is active', () => {
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('should toggle accounts on checkbox change', () => {
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockSwitchWalletAccount).toHaveBeenCalledWith('demo123');
    });
});
