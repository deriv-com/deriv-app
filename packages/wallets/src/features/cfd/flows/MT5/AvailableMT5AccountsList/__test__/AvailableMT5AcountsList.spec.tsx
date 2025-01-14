import React from 'react';
import { useActiveWalletAccount, useIsEuRegion, useMT5AccountsList, useTradingPlatformStatus } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientVerificationModal } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import { MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../../../constants';
import { MT5PasswordModal, TradingPlatformStatusModal } from '../../../../modals';
import AvailableMT5AccountsList from '../AvailableMT5AccountsList';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useIsEuRegion: jest.fn(),
    useMT5AccountsList: jest.fn(),
    useTradingPlatformStatus: jest.fn(),
}));

jest.mock('../../../../../../components/ModalProvider', () => ({
    useModal: jest.fn(),
}));

describe('AvailableMT5AccountsList', () => {
    const mockShow = jest.fn();
    const mockSetModalState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: false },
        });
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'active'),
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [],
        });
        (useModal as jest.Mock).mockReturnValue({
            setModalState: mockSetModalState,
            show: mockShow,
        });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: false,
        });
    });

    const nonRegulatedAccount = {
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'swap_free',
        shortcode: 'svg',
    };

    const regulatedVerifiedAccount = {
        client_kyc_status: {
            poi_status: 'verified',
            valid_tin: 1,
        },
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'swap_free',
        shortcode: 'svg',
    };

    const regulatedUnverifiedAccount = {
        client_kyc_status: {
            poi_status: 'none',
            valid_tin: 0,
        },
        market_type: 'synthetic',
        platform: 'mt5',
        product: 'financial',
        shortcode: 'bvi',
    };

    it('renders default content for available mt5 account', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        expect(screen.getByTestId('dt_wallets_trading_account_card')).toBeInTheDocument();
        expect(screen.getByText('Standard')).toBeInTheDocument();
    });

    it('handles button click when platform status is active for real wallet account', async () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<MT5PasswordModal account={nonRegulatedAccount} isVirtual={false} />);
        expect(mockSetModalState).toHaveBeenCalledWith('marketType', 'synthetic');
        expect(mockSetModalState).toHaveBeenCalledWith('selectedJurisdiction', 'svg');
    });

    it('shows TradingPlatformStatusModal when there is an unavailable account', async () => {
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [{ status: 'unavailable' }],
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(<TradingPlatformStatusModal status={MT5_ACCOUNT_STATUS.UNAVAILABLE} />);
    });

    it('shows TradingPlatformStatusModal when there is an unavailable platform', async () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'unavailable'),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(
            <TradingPlatformStatusModal status={TRADING_PLATFORM_STATUS.UNAVAILABLE} />
        );
    });

    it('shows TradingPlatformStatusModal with isServerMaintenance when platform status is maintenance', async () => {
        (useTradingPlatformStatus as jest.Mock).mockReturnValue({
            getPlatformStatus: jest.fn(() => 'maintenance'),
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        expect(mockShow).toHaveBeenCalledWith(
            <TradingPlatformStatusModal status={TRADING_PLATFORM_STATUS.MAINTENANCE} />
        );
    });

    it('shows MT5PasswordModal for non-regulated real accounts if client is verified', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={nonRegulatedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<MT5PasswordModal account={nonRegulatedAccount} />);
    });

    it('shows ClientVerificationModal for regulated real accounts if client is unverified', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: false,
            },
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={regulatedUnverifiedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<ClientVerificationModal account={regulatedUnverifiedAccount} />);
    });

    it('shows MT5PasswordModal for demo accounts for verified clients', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<AvailableMT5AccountsList account={regulatedVerifiedAccount} />);

        const button = screen.getByTestId('dt_wallets_trading_account_card');
        await userEvent.click(button);

        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        expect(mockShow).toHaveBeenCalledWith(<MT5PasswordModal account={regulatedVerifiedAccount} isVirtual={true} />);
    });
});
