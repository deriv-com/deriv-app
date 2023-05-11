import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadyToUpgradeWallets from '../ready-to-upgrade-wallets';

describe('ReadyToUpdateWallets', () => {
    const toggleCheckbox = jest.fn();
    it('should render', () => {
        const { container } = render(<ReadyToUpgradeWallets is_eu={false} toggleCheckbox={toggleCheckbox} />);
        expect(container).toBeInTheDocument();
    });

    it('should render checkbox', () => {
        render(<ReadyToUpgradeWallets is_eu={false} toggleCheckbox={toggleCheckbox} />);
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render info section based on region', () => {
        render(<ReadyToUpgradeWallets is_eu={false} toggleCheckbox={toggleCheckbox} />);
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
