import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import PasswordsPlatform from '../passwords-platform';

describe('<PasswordsPlatform />', () => {
    const mock_props = {
        has_dxtrade_accounts: false,
        has_mt5_accounts: true,
    };

    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const store = mockStore({ client: { email: 'test@demo.com' } });

    type TRenderComponent = {
        props: React.ComponentProps<typeof PasswordsPlatform>;
        store_config: ReturnType<typeof mockStore>;
    };

    const renderComponent = ({ props = mock_props, store_config = store }: Partial<TRenderComponent>) =>
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <PasswordsPlatform {...props} />
                </StoreProvider>
            </APIProvider>
        );

    it('should render DX password section when platform is MT5', async () => {
        renderComponent({});

        expect(screen.getByText('Deriv MT5 Password')).toBeInTheDocument();
    });

    it('should render DX password section when platform is DerivX', async () => {
        const new_props: React.ComponentProps<typeof PasswordsPlatform> = {
            ...mock_props,
            has_dxtrade_accounts: true,
            has_mt5_accounts: false,
        };
        renderComponent({ props: new_props });

        expect(screen.getByText('Deriv X Password')).toBeInTheDocument();
    });

    it('should open Send email modal when Change password button is clicked', async () => {
        renderComponent({});

        userEvent.click(screen.getByRole('button', { name: /change password/i }));
        await waitFor(() => {
            const el_modal = screen.getByText('We’ve sent you an email');
            expect(el_modal).toBeInTheDocument();
        });
    });
});
