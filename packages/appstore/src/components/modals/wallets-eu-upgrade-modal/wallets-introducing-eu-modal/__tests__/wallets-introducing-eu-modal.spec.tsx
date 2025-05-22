import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WalletsIntroducingEuModal from '../wallets-introducing-eu-modal';

describe('<WalletsIntroducingEuModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    const mockOnClickHandler = jest.fn();

    const renderComponent = (is_open = true, store_config = {}) => {
        const mock_root_store = mockStore({
            ui: {
                is_desktop: true,
                ...store_config,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_root_store}>{children}</StoreProvider>
        );

        return render(<WalletsIntroducingEuModal is_open={is_open} onClickHandler={mockOnClickHandler} />, { wrapper });
    };

    it('renders the modal with proper content', () => {
        renderComponent();

        expect(screen.getByText('Introducing Wallets')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Take control of your funds management with Wallet! Enjoy fast and secure transactions with funds segregation.'
            )
        ).toBeInTheDocument();
    });

    it('calls onClickHandler when Enable now button is clicked', async () => {
        renderComponent();

        const enable_button = screen.getByText('Enable now');
        await userEvent.click(enable_button);

        expect(mockOnClickHandler).toHaveBeenCalledTimes(1);
    });

    it('does not render the modal when is_open is false', () => {
        renderComponent(false);

        expect(screen.queryByText('Introducing Wallets')).not.toBeInTheDocument();
    });
});
