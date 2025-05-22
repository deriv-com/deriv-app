import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WalletsReadyToEnableEuModal from '../wallets-ready-to-enable-eu-modal';

describe('<WalletsReadyToEnableEuModal />', () => {
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

        return render(<WalletsReadyToEnableEuModal is_open={is_open} onClickHandler={mockOnClickHandler} />, {
            wrapper,
        });
    };

    it('renders the modal with proper content', () => {
        renderComponent();

        expect(screen.getByText('Ready to enable Wallets')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Wallets will become your dedicated fund management tool, allowing you to transfer funds between your Wallet and trading accounts instantly.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('Your open trading positions will not be affected while we are setting up your wallets.')
        ).toBeInTheDocument();
    });

    it('calls onClickHandler when Enable button is clicked', async () => {
        renderComponent();

        const enable_button = screen.getByText('Enable');
        await userEvent.click(enable_button);

        expect(mockOnClickHandler).toHaveBeenCalledTimes(1);
    });

    it('does not render the modal when is_open is false', () => {
        renderComponent(false);

        expect(screen.queryByText('Ready to enable Wallets')).not.toBeInTheDocument();
    });
});
