import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isMobile, isDesktop } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import ReadyToUpdateWallets from 'Components/modals/real-wallets-upgrade/components/ready-to-update-wallets';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
    isDesktop: jest.fn(() => true),
}));

export const mockRootStore = mockStore({
    client: { is_eu: false, is_high_risk: false },
    traders_hub: { is_eu_user: false },
});

describe('<ReadyToUpdateWallets />', () => {
    let modal_root_el: HTMLDivElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => document.body.removeChild(modal_root_el));
    beforeEach(() => jest.clearAllMocks());

    it('should render modal', () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ReadyToUpdateWallets />
            </StoreProvider>
        );
        expect(screen.getByText('Ready to upgrade?')).toBeInTheDocument();
    });

    it('should not disabled button when the checkbox is active', async () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ReadyToUpdateWallets />
            </StoreProvider>
        );

        userEvent.click(screen.getByRole('checkbox'));

        await waitFor(() => {
            expect(screen.getByText('Upgrade to Wallets')).toBeEnabled();
        });
    });

    it('should render info section based on clients country and risk status', () => {
        render(
            <StoreProvider store={mockRootStore}>
                <ReadyToUpdateWallets />
            </StoreProvider>
        );
        expect(
            screen.getByText(
                'During the upgrade, deposits, withdrawals, transfers, and adding new accounts will be unavailable.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("Your open positions won't be affected and you can continue trading.")
        ).toBeInTheDocument();
    });

    it('should render "MobileDialog" component in the mobile view', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(
            <StoreProvider store={mockRootStore}>
                <ReadyToUpdateWallets />
            </StoreProvider>
        );
    });
});
