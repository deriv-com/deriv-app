import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadyToUpgradeWallets from '../ready-to-upgrade-wallets';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('ReadyToUpgradeWallets', () => {
    const containerReadyToUpgradeWallets = (mock: ReturnType<typeof mockStore>) => {
        const toggleCheckbox = jest.fn();
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        return render(<ReadyToUpgradeWallets toggleCheckbox={toggleCheckbox} value={false} />, {
            wrapper,
        });
    };

    it('should render ReadyToUpgradeWallets component', () => {
        const mock = mockStore({});
        const { container } = containerReadyToUpgradeWallets(mock);

        expect(container).toBeInTheDocument();
    });

    it('should render checkbox', () => {
        const mock = mockStore({});
        containerReadyToUpgradeWallets(mock);

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should render proper info sections for non-eu user', () => {
        const mock = mockStore({});
        containerReadyToUpgradeWallets(mock);

        expect(
            screen.getByText(
                'During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be unavailable.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("Your open positions won't be affected and you can continue trading.")
        ).toBeInTheDocument();
        expect(screen.getByText(/you can use/i)).toBeInTheDocument();
        expect(screen.getByText(/payment agents'/i)).toBeInTheDocument();
        expect(
            screen.getByText(/services to deposit by adding a Payment Agent Wallet after the upgrade./i)
        ).toBeInTheDocument();
        expect(screen.getByText(/Deriv P2P/)).toBeInTheDocument();
        expect(screen.getByText(/is unavailable in Wallets at this time/i)).toBeInTheDocument();
    });

    describe('should render proper info sections for eu user with different content flags', () => {
        const validateAssertion = () => {
            expect(
                screen.getByText(
                    'During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be unavailable.'
                )
            ).toBeInTheDocument();
            expect(
                screen.getByText("Your open positions won't be affected and you can continue trading.")
            ).toBeInTheDocument();
            expect(screen.queryByText(/you can use/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/payment agents'/i)).not.toBeInTheDocument();
            expect(
                screen.queryByText(/services to deposit by adding a Payment Agent Wallet after the upgrade./i)
            ).not.toBeInTheDocument();
            expect(screen.queryByText(/Deriv P2P/)).not.toBeInTheDocument();
            expect(screen.queryByText(/is unavailable in Wallets at this time/i)).not.toBeInTheDocument();
        };

        it('should render proper info sections for eu user with eu_demo content flag', () => {
            const mock = mockStore({ traders_hub: { content_flag: 'eu_demo' } });
            containerReadyToUpgradeWallets(mock);

            validateAssertion();
        });

        it('should render proper info sections for eu user with eu_real content flag', () => {
            const mock = mockStore({ traders_hub: { content_flag: 'eu_real' } });
            containerReadyToUpgradeWallets(mock);

            validateAssertion();
        });

        it('should render proper info sections for eu user with low_risk_cr_eu content flag', () => {
            const mock = mockStore({ traders_hub: { content_flag: 'low_risk_cr_eu' } });
            containerReadyToUpgradeWallets(mock);

            validateAssertion();
        });
    });
});
