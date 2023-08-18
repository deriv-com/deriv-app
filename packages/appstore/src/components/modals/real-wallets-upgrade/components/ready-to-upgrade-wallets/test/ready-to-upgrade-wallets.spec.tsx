import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadyToUpgradeWallets from '../ready-to-upgrade-wallets';
import { StoreProvider, mockStore } from '@deriv/stores';

const mock = mockStore({});

const checkContainerReadyToUpgradeWallets = () => {
    const toggleCheckbox = jest.fn();
    const wrapper = ({ children }: { children: JSX.Element }) => <StoreProvider store={mock}>{children}</StoreProvider>;

    const { container } = render(<ReadyToUpgradeWallets is_eu={false} toggleCheckbox={toggleCheckbox} />, {
        wrapper,
    });
    expect(container).toBeInTheDocument();
};

describe('ReadyToUpgradeWallets', () => {
    it('should render', () => {
        checkContainerReadyToUpgradeWallets();
    });

    it('should render checkbox', () => {
        checkContainerReadyToUpgradeWallets();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render info section based on region', () => {
        checkContainerReadyToUpgradeWallets();
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
