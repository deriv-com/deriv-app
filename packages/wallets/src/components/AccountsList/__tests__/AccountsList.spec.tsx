import React, { ComponentProps, PropsWithChildren } from 'react';
import { WalletTourGuide } from 'src/components/WalletTourGuide';
import { APIProvider, useActiveWalletAccount, useGrowthbookIsOn, useIsEuRegion } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import AccountsList from '../AccountsList';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({})),
}));

const mockWalletTourGuide = jest.fn();
jest.mock(
    '../../WalletTourGuide/WalletTourGuide',
    // eslint-disable-next-line react/display-name
    () => (props: ComponentProps<typeof WalletTourGuide>) => {
        mockWalletTourGuide(props);
        return (
            <div>
                <p>mock wallet tour guide</p>
            </div>
        );
    }
);

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useGrowthbookIsOn: jest.fn(),
    useIsEuRegion: jest.fn(),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <WalletsAuthProvider>
            <ModalProvider>{children}</ModalProvider>
        </WalletsAuthProvider>
    </APIProvider>
);

describe('AccountsList', () => {
    beforeEach(() => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                account_type: 'doughflow',
                currency_config: { display_code: 'USD', fractional_digits: 2 },
                is_virtual: false,
                loginid: 'CRW1234',
                wallet_currency_type: 'USD',
            },
        });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: false,
            isLoading: false,
        });
        (useGrowthbookIsOn as jest.Mock).mockReturnValue([true]);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('renders account list in mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });

        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
        expect(screen.getByText('Compare accounts')).toBeInTheDocument();
    });

    it('shows Options tab in mobile view when the tab active', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        const { rerender } = render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();

        screen.getAllByText('Options')[0].click();
        rerender(<AccountsList accountsActiveTabIndex={1} onTabClickHandler={jest.fn()} />);
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();
        expect(screen.getByText('Deriv Trader')).toBeInTheDocument();
        expect(screen.getByText('Deriv Bot')).toBeInTheDocument();
        expect(screen.getByText('SmartTrader')).toBeInTheDocument();
        expect(screen.getByText('Deriv GO')).toBeInTheDocument();
    });

    it('shows Multipliers tab when is_eu is true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: true,
            isLoading: false,
        });
        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, { wrapper });
        expect(screen.getByText('Multipliers')).toBeInTheDocument();
        expect(screen.queryByText('Options')).not.toBeInTheDocument();
        expect(
            screen.getByText('Trade bigger positions with less capital on a wide range of global markets.')
        ).toBeInTheDocument();
    });

    it('shows Options tab when is_eu is false', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: false,
            isLoading: false,
        });
        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, { wrapper });
        expect(screen.queryByText('Multipliers')).not.toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
    });

    it('show the loader when isEuRegion is loading', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            data: false,
            isLoading: true,
        });
        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, { wrapper });
        expect(screen.getByTestId('dt_wallets_tabs_loader')).toBeInTheDocument();
    });

    it('triggers `onTabClickHandler` with proper tab index when the user switches the tab', () => {
        const onTabClickHandler = jest.fn();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={onTabClickHandler} />, {
            wrapper,
        });

        screen.getAllByText('Options')[0].click();
        expect(onTabClickHandler).toHaveBeenCalledWith(1);
    });

    it('renders account list in desktop view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<AccountsList />, { wrapper });

        expect(screen.getByTestId('dt_desktop_accounts_list')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();
    });

    it('renders P2P redirection banner in desktop view', () => {
        render(<AccountsList />, { wrapper });

        expect(screen.getByText('Easily exchange USD with local currency using Deriv P2P.')).toBeInTheDocument();
    });

    it('renders P2P redirection banner in mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<AccountsList />, { wrapper });

        expect(screen.getByText('Easily exchange USD with local currency using Deriv P2P.')).toBeInTheDocument();
    });

    it('does not render P2P redirection banner if growthbook is not loaded', () => {
        (useGrowthbookIsOn as jest.Mock).mockReturnValue([false]);
        render(<AccountsList />, { wrapper });

        expect(screen.queryByText('Easily exchange USD with local currency using Deriv P2P.')).not.toBeInTheDocument();
    });

    it('renders wallet tour guide in mobile view with isWalletSettled set to false', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });

        expect(mockWalletTourGuide);
    });

    it('renders wallet tour guide in mobile view with isWalletSettled set to true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });

        expect(mockWalletTourGuide);
    });
});
