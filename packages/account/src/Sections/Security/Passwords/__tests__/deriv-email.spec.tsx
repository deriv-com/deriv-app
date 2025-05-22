import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import DerivEmail from '../deriv-email';

describe('DerivEmail', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const store = mockStore({ client: { email: 'test@demo.com' } });

    const renderComponent = ({ store_config = store }) =>
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <DerivEmail />
                </StoreProvider>
            </APIProvider>
        );

    it('should render message properly', () => {
        renderComponent({});

        expect(screen.getByText(/This is the email address associated with your Deriv account./i)).toBeInTheDocument();
    });

    it('should display button when it is not redirected from deriv-go', () => {
        renderComponent({});

        const el_button = screen.getByRole('button', { name: /Change email/i });
        expect(el_button).toBeInTheDocument();
    });

    it('should not display button when it is redirected from deriv-go', () => {
        renderComponent({
            store_config: mockStore({
                common: { is_from_derivgo: true },
            }),
        });

        const el_button = screen.queryByRole('button', { name: /Change email/i });
        expect(el_button).not.toBeInTheDocument();
    });

    it('should display unlink account modal when button is clicked', async () => {
        const store_config = mockStore({ client: { social_identity_provider: 'Google', is_social_signup: true } });
        renderComponent({ store_config });
        const el_button = screen.getByRole('button', { name: /Change email/i });
        await userEvent.click(el_button);
        let el_modal;
        await waitFor(() => {
            el_modal = screen.getByText('Change your login email');
            expect(el_modal).toBeInTheDocument();
        });
        const el_unlink_btn = screen.getByRole('button', { name: /Unlink from Google/i });
        await userEvent.click(el_unlink_btn);

        await waitFor(() => {
            el_modal = screen.getByText('We’ve sent you an email');
            expect(el_modal).toBeInTheDocument();
        });
    });
});
