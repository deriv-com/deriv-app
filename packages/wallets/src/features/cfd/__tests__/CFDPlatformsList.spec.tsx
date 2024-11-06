import React from 'react';
import { APIProvider, useActiveWalletAccount, useIsEuRegion } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../AuthProvider';
import CFDPlatformsList from '../CFDPlatformsList';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            currency_config: {
                is_crypto: false,
            },
        },
    })),
    useIsEuRegion: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ push: mockPush })),
}));

// eslint-disable-next-line react/display-name
jest.mock('../CFDPlatformsListEmptyState', () => () => <div>CFDPlatformsListEmptyState</div>);

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    CFDPlatformsListAccounts: jest.fn(() => <div>CFDPlatformsListAccounts</div>),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;
const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('CFDPlatformsList', () => {
    describe('Mobile/Tablet view', () => {
        it('renders proper content', () => {
            //@ts-expect-error we only need partial action types
            mockUseDevice.mockReturnValueOnce({ isMobile: true });
            (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
                data: false,
                isLoading: false,
            }));
            render(<CFDPlatformsList />, { wrapper });

            expect(
                screen.getByText('Trade bigger positions with less capital on a wide range of global markets.')
            ).toBeInTheDocument();
            expect(screen.getByText('Learn more')).toBeInTheDocument();
            expect(screen.getByText('Compare accounts')).toBeInTheDocument();
        });

        it('opens proper link when the user is clicking on `Learn more` text', () => {
            //@ts-expect-error we only need partial action types
            mockUseDevice.mockReturnValueOnce({ isMobile: true });
            (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
                data: false,
                isLoading: false,
            }));
            render(<CFDPlatformsList />, { wrapper });

            const learnMoreEl = screen.getByRole('link', { name: 'Learn more' });

            expect(learnMoreEl).toHaveAttribute('href', 'https://deriv.com/trade-types/cfds/');
        });

        it('redirects to `/compare-accounts` route when the user is clicking on `Compare accounts` button', () => {
            //@ts-expect-error we only need partial action types
            mockUseDevice.mockReturnValueOnce({ isMobile: true });
            (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
                data: false,
                isLoading: false,
            }));
            render(<CFDPlatformsList />, { wrapper });

            const compareAccountsBtn = screen.getByText('Compare accounts');
            userEvent.click(compareAccountsBtn);

            expect(mockPush).toHaveBeenCalledWith('/compare-accounts');
        });
    });

    describe('Desktop view', () => {
        it('renders proper content', () => {
            (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
                data: false,
                isLoading: false,
            }));
            render(<CFDPlatformsList />, { wrapper });

            expect(screen.getByText('CFDs')).toBeInTheDocument();
            expect(
                screen.getByText('Trade bigger positions with less capital on a wide range of global markets.')
            ).toBeInTheDocument();
            expect(screen.getByText('Learn more')).toBeInTheDocument();
            expect(screen.getByText('Compare accounts')).toBeInTheDocument();
        });

        it('opens proper link when the user is clicking on `Learn more` text', () => {
            (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
                data: false,
                isLoading: false,
            }));
            render(<CFDPlatformsList />, { wrapper });

            const learnMoreEl = screen.getByRole('link', { name: 'Learn more' });

            expect(learnMoreEl).toHaveAttribute('href', 'https://deriv.com/trade-types/cfds');
        });

        it('redirects to `/compare-accounts` route when the user is clicking on `Compare accounts` button', () => {
            (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
                data: false,
                isLoading: false,
            }));
            render(<CFDPlatformsList />, { wrapper });

            const compareAccountsBtn = screen.getByText('Compare accounts');
            userEvent.click(compareAccountsBtn);

            expect(mockPush).toHaveBeenCalledWith('/compare-accounts');
        });
    });

    it('renders proper content for fiat accounts', () => {
        (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
            data: false,
            isLoading: false,
        }));
        render(<CFDPlatformsList />, { wrapper });

        expect(screen.getByText('CFDPlatformsListAccounts')).toBeInTheDocument();
    });

    it('renders proper content for crypto accounts', () => {
        (useIsEuRegion as jest.Mock).mockReturnValue(() => ({
            data: false,
            isLoading: false,
        }));
        mockUseActiveWalletAccount.mockReturnValueOnce({
            data: {
                //@ts-expect-error we only need partial action types
                currency_config: {
                    is_crypto: true,
                },
            },
        });
        render(<CFDPlatformsList />, { wrapper });

        expect(screen.getByText('CFDPlatformsListEmptyState')).toBeInTheDocument();
    });
});
