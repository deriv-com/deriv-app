import React from 'react';
import GetMoreWalletCard from '../get-more-wallet-card';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('GetMoreWalletCard', () => {
    it('should render correctly', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { container } = render(<GetMoreWalletCard />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should render the correct icon and text and classname', () => {
        const mock = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        render(<GetMoreWalletCard />, { wrapper });
        expect(screen.getByText('Get more wallets')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveClass('get-more-wallet-card--button');
    });
});
