import React, { ComponentProps, PropsWithChildren } from 'react';
import { WalletTourGuide } from 'src/components/WalletTourGuide';
import { APIProvider } from '@deriv/api-v2';
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
    useIsEuRegion: jest.fn(() => ({
        data: false,
    })),
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
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should render account list in mobile view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });

        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Options')).toBeInTheDocument();
        expect(screen.getByText('Compare accounts')).toBeInTheDocument();
    });

    it('should show Options tab in mobile view when the tab active', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();

        screen.getAllByText('Options')[0].click();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();
        expect(screen.getByText('Deriv Trader')).toBeInTheDocument();
        expect(screen.getByText('Deriv Bot')).toBeInTheDocument();
        expect(screen.getByText('SmartTrader')).toBeInTheDocument();
        expect(screen.getByText('Deriv GO')).toBeInTheDocument();
    });

    it('should trigger `onTabClickHandler` with proper tab index when the user switches the tab', () => {
        const onTabClickHandler = jest.fn();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={onTabClickHandler} />, {
            wrapper,
        });

        screen.getAllByText('Options')[0].click();
        expect(onTabClickHandler).toHaveBeenCalledWith(1);
    });

    it('should render account list in desktop view', () => {
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });
        render(<AccountsList />, { wrapper });

        expect(screen.getByTestId('dt_desktop_accounts_list')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getAllByText('Options')[0]).toBeInTheDocument();
    });

    it('should render wallet tour guide in mobile view with isWalletSettled set to false', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });

        expect(mockWalletTourGuide);
    });

    it('should render wallet tour guide in mobile view with isWalletSettled set to true', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });

        render(<AccountsList accountsActiveTabIndex={0} onTabClickHandler={jest.fn()} />, {
            wrapper,
        });

        expect(mockWalletTourGuide);
    });
});
