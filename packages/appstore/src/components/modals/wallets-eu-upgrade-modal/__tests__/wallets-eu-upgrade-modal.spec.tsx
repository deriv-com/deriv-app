import React from 'react';

import { useWalletMigration } from '@deriv/hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WalletsEUUpgradeModal from '../wallets-eu-upgrade-modal';

jest.mock('@deriv/hooks', () => ({
    useWalletMigration: jest.fn(),
}));

describe('WalletsEUUpgradeModal', () => {
    let modal_root_el: HTMLDivElement, mockStartMigration: jest.Mock;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    const renderComponent = (store_config = {}) => {
        const mock_root_store = mockStore({
            ui: {
                is_desktop: true,
                ...store_config,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_root_store}>{children}</StoreProvider>
        );

        return render(<WalletsEUUpgradeModal />, { wrapper });
    };

    beforeEach(() => {
        mockStartMigration = jest.fn();
        (useWalletMigration as jest.Mock).mockReturnValue({
            startMigration: mockStartMigration,
        });
    });

    it('renders IntroducingWalletsEuModal by default', () => {
        renderComponent();

        expect(screen.getByText('Introducing Wallets')).toBeInTheDocument();
    });

    it('switches to WalletsReadyToEnableEuModal when intro button is clicked', async () => {
        renderComponent();

        const enableNowBtn = screen.getByRole('button', { name: 'Enable now' });
        await userEvent.click(enableNowBtn);

        expect(screen.getByText('Ready to enable Wallets')).toBeInTheDocument();
    });

    it('starts migration when enable button is clicked', async () => {
        renderComponent();

        const enableNowBtn = screen.getByRole('button', { name: 'Enable now' });
        await userEvent.click(enableNowBtn);

        const enableBtn = screen.getByRole('button', { name: 'Enable' });
        await userEvent.click(enableBtn);

        expect(mockStartMigration).toHaveBeenCalledTimes(1);
    });

    it('hides both modals after migration starts', async () => {
        renderComponent();

        const enableNowBtn = screen.getByRole('button', { name: 'Enable now' });
        await userEvent.click(enableNowBtn);

        const enableBtn = screen.getByRole('button', { name: 'Enable' });
        await userEvent.click(enableBtn);

        expect(screen.queryByText('Introducing Wallets')).not.toBeInTheDocument();
        expect(screen.queryByText('Ready to enable Wallets')).not.toBeInTheDocument();
    });
});
