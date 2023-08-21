import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadyToUpgradeWallets from '../ready-to-upgrade-wallets';
import { StoreProvider, mockStore } from '@deriv/stores';

const mock = mockStore({});

describe('ReadyToUpgradeWallets', () => {
    const containerReadyToUpgradeWallets = () => {
        const toggleCheckbox = jest.fn();
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        return render(<ReadyToUpgradeWallets is_eu={false} toggleCheckbox={toggleCheckbox} value={false} />, {
            wrapper,
        });
    };

    it('should render', () => {
        const { container } = containerReadyToUpgradeWallets();
        expect(container).toBeInTheDocument();
    });

    it('should render checkbox', () => {
        containerReadyToUpgradeWallets();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render info section based on region', () => {
        containerReadyToUpgradeWallets();
        expect(
            screen.getByText(
                'During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be unavailable.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("Your open positions won't be affected and you can continue trading.")
        ).toBeInTheDocument();
    });
});
