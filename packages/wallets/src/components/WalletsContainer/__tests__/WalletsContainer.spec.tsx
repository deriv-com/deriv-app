import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import WalletsContainer from '../WalletsContainer';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

describe('WalletsContainer', () => {
    const renderHeaderMock = jest.fn(() => <div data-testid='header'>Header</div>);
    const children = <div data-testid='children'>Children</div>;

    beforeEach(() => {
        renderHeaderMock.mockClear();
    });

    it('should render the default component if no data available', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: undefined,
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>);

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('children')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_container')).toHaveClass('wallets-container');
        expect(screen.getByTestId('dt_wallets_container_header')).toHaveClass('wallets-container__header');
    });

    it('should apply virtual class when is virtual is true', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_active: false,
                is_virtual: true,
            },
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>);

        expect(screen.getByTestId('dt_wallets_container_header')).toHaveClass('wallets-container__header--virtual');
        expect(screen.getByTestId('dt_wallets_container')).toHaveClass('wallets-container--virtual');
    });

    it('should scroll into view when is active is true', async () => {
        const scrollIntoViewMock = jest.fn();
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_active: true,
                is_virtual: false,
            },
        });

        render(<WalletsContainer renderHeader={renderHeaderMock}>{children}</WalletsContainer>);

        const containerElement = screen.getByTestId('dt_wallets_container');
        if (containerElement) {
            containerElement.scrollIntoView = scrollIntoViewMock;
        }

        await waitFor(() => {
            expect(scrollIntoViewMock).toHaveBeenCalled();
        });

        expect(containerElement).toHaveStyle('scroll-margin-top: 80px');
    });
});
