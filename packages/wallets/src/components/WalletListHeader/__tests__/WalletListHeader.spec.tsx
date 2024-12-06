import React from 'react';
import { useActiveWalletAccount, useIsEuRegion, useWalletAccountsList } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { defineSwitcherWidth } from '../../../utils/utils';
import WalletListHeader from '../WalletListHeader';

const mockRedirectToOutSystems = jest.fn();

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({ data: { is_virtual: false, loginid: 'real1' } })),
    useIsEuRegion: jest.fn(() => ({ data: false })),
    useWalletAccountsList: jest.fn(() => ({
        data: [
            { is_virtual: false, loginid: 'real1' },
            { is_virtual: true, loginid: 'demo123' },
        ],
    })),
}));

const mockSwitchWalletAccount = jest.fn();

jest.mock('../../../hooks/useWalletAccountSwitcher', () => ({
    __esModule: true,
    default: jest.fn(() => mockSwitchWalletAccount),
}));

jest.mock('../../../utils/utils', () => ({
    ...jest.requireActual('../../../utils/utils'),
    defineSwitcherWidth: jest.fn(),
}));

jest.mock('../../../helpers/urls', () => ({
    redirectToOutSystems: mockRedirectToOutSystems,
}));

describe('WalletListHeader', () => {
    beforeAll(() => {
        global.ResizeObserver = class {
            observe = () => jest.fn();
            unobserve = () => jest.fn();
            disconnect = () => jest.fn();
        };
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders header content correctly', () => {
        render(<WalletListHeader />);

        expect(screen.getByText("Trader's Hub")).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
        expect(screen.getByText('Real')).toBeInTheDocument();
    });

    it('checks the checkbox if the real account is active', () => {
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('toggles accounts on checkbox change', async () => {
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        await userEvent.click(checkbox);
        expect(mockSwitchWalletAccount).toHaveBeenCalledWith('demo123');
    });

    it('toggles to the first real account when the demo account is active', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { is_virtual: true, loginid: 'demo123' } });
        render(<WalletListHeader />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        await userEvent.click(checkbox);

        expect(mockSwitchWalletAccount).toHaveBeenCalledWith('real1');
    });

    it('calls defineSwitcherWidth on language change', () => {
        render(<WalletListHeader />);

        expect(defineSwitcherWidth).toHaveBeenCalled();
    });

    it('renders the switcher with the correct class when all the real wallets are disabled', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [
                { is_disabled: true, is_virtual: false, loginid: 'real1' },
                { is_virtual: true, loginid: 'demo123' },
            ],
        });

        render(<WalletListHeader />);

        const switcher = screen.getByTestId('dt_wallets_list_header__label_item_real');
        expect(switcher).toHaveClass('wallets-list-header__label-item--disabled');
    });

    it('renders an enabled switcher when an EU user has no real account', () => {
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [{ is_virtual: true, loginid: 'demo123' }],
        });
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });

        render(<WalletListHeader />);

        const switcher = screen.getByTestId('dt_wallets_list_header__label_item_real');
        expect(switcher).not.toHaveClass('wallets-list-header__label-item--disabled');
    });

    it('calls the redirectToOutSystems function when the real tab is clicked for EU users without real wallets', async () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [{ is_virtual: true, loginid: 'demo123' }],
        });

        render(<WalletListHeader />);

        const switcher = screen.getByTestId('dt_wallets_list_header__label_item_real');
        await userEvent.click(switcher);

        expect(mockRedirectToOutSystems).not.toHaveBeenCalled();
    });
    it('does not call the redirectToOutSystems function when the real tab is clicked for non-EU users without real wallets', async () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: false });
        (useWalletAccountsList as jest.Mock).mockReturnValue({
            data: [{ is_virtual: true, loginid: 'demo123' }],
        });

        render(<WalletListHeader />);

        const switcher = screen.getByTestId('dt_wallets_list_header__label_item_real');
        await userEvent.click(switcher);

        expect(mockRedirectToOutSystems).not.toHaveBeenCalled();
    });

    it('does not call redirectToOutSystems when the active wallet is a real account', async () => {
        (useIsEuRegion as jest.Mock).mockReturnValue({ data: true });
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { is_virtual: false, loginid: 'real1' } });

        render(<WalletListHeader />);

        const switcher = screen.getByTestId('dt_wallets_list_header__label_item_real');
        await userEvent.click(switcher);

        expect(mockRedirectToOutSystems).not.toHaveBeenCalled();
    });
});
