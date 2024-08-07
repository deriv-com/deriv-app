import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { CFDStoreProvider } from '../../../Stores/Modules/CFD/Helpers/useCfdStores';
import MigrationSuccessModalContent from '../migration-success-modal-content';

const mock_store = mockStore({});

const wrapper = ({ children }) => (
    <StoreProvider store={mock_store}>
        <CFDStoreProvider>{children}</CFDStoreProvider>;
    </StoreProvider>
);
describe('<MigrationSuccessModal />', () => {
    const props: React.ComponentProps<typeof MigrationSuccessModalContent> = {
        icon: 'icon',
        eligible_account_to_migrate: 'BVI',
        closePopupModal: jest.fn(),
        jurisdiction_market_name: ['Financial'],
    };
    it('component should be rendered', () => {
        render(<MigrationSuccessModalContent {...props} />, { wrapper });

        expect(
            screen.getByRole('heading', {
                name: /Upgrade complete/i,
            })
        ).toBeInTheDocument();

        const account_text = screen.getByText(/Start trading with your new/i);
        const strong_text = within(account_text).getByText(/MT5 Financial BVI/i);

        expect(account_text).toBeInTheDocument();
        expect(strong_text.tagName).toBe('STRONG');

        expect(screen.getByText(/Important: Your account./i)).toBeInTheDocument();

        expect(
            screen.getByText(/You can manage your existing positions, but you can't start a new trade./i)
        ).toBeInTheDocument();

        expect(screen.getByText(/We'll close accounts with no open positions after 60 days./i)).toBeInTheDocument();

        const button = screen.getByRole('button', {
            name: /ok/i,
        });

        userEvent.click(button);
        expect(props.closePopupModal).toHaveBeenCalled();
    });
});
