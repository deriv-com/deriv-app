import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DerivXPassword from '../deriv-x-password';
import { APIProvider, useMutation } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    AccountsDerivXIcon: () => 'AccountsDerivXIcon',
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(() => ({ mutate: jest.fn() })),
}));

describe('<DerivXPassword />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const store = mockStore({ client: { email: 'mf@deriv.com' } });

    const renderComponent = ({ store_config = store }) =>
        render(
            <APIProvider>
                <StoreProvider store={store_config}>
                    <DerivXPassword />
                </StoreProvider>
            </APIProvider>
        );

    it('Should render properly', async () => {
        renderComponent({});

        expect(screen.getAllByText(/deriv x password/i)).toHaveLength(2);
        expect(
            screen.getByText(/use your to log in to your Deriv X accounts on the web and mobile apps\./i)
        ).toBeInTheDocument();
        expect(screen.queryByText(/AccountsDerivXIcon/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change password/i })).toBeInTheDocument();
        expect(screen.queryByText(/unlink from/i)).not.toBeInTheDocument();
    });

    it('displays a change password button', () => {
        renderComponent({});
        const change_password_button = screen.getByRole('button', {
            name: /change password/i,
        });

        expect(change_password_button).toBeInTheDocument();
    });

    it('should invoke useMutation when change password is clicked', async () => {
        renderComponent({});
        const ele_change_btn = screen.getByRole('button', {
            name: /change password/i,
        });
        fireEvent.click(ele_change_btn);
        expect(screen.queryByText(/we’ve sent you an email/i)).toBeInTheDocument();
        expect(screen.getByText(/please click on the link in the email to change your/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(useMutation).toHaveBeenCalled();
        });
    });
});
