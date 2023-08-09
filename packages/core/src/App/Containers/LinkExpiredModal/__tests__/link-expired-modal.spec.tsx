import React from 'react';
import { APIProvider, useRequest } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkExpiredModal from '../link-expired-modal';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(),
}));

// @ts-expect-error ignore this until find a way to make arguments as partial
const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'verify_email'>>;

describe('LinkExpiredModal', () => {
    it('should render the component when is_link_expired_modal_visible is true', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore({ ui: { is_link_expired_modal_visible: true } });
        render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
        expect(screen.queryByText('Link expired')).toBeInTheDocument();
    });

    it('should not render the component when is_link_expired_modal_visible is false', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore({});
        render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
        expect(screen.queryByText('Link expired')).not.toBeInTheDocument();
    });

    it('should not render the component close and resend email buttons', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore({ ui: { is_link_expired_modal_visible: true } });
        render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
        expect(screen.getByRole('button', { name: /Close/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resend email/ })).toBeInTheDocument();
    });

    it('should keep the resend mail button disabled until a valid email is entered', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore({ ui: { is_link_expired_modal_visible: true } });
        render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
        const resend_button = screen.getByRole('button', { name: /Resend email/ });
        expect(resend_button).toBeDisabled();
        fireEvent.change(screen.getByRole('textbox', { name: /Email address/i }), {
            target: { value: 'test.mail@domain.com' },
        });
        expect(resend_button).toBeEnabled();
    });

    it('should close the modal on clicking close button', async () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore({ ui: { is_link_expired_modal_visible: true } });
        render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
        const close_button = screen.getByRole('button', { name: /Close/ });
        userEvent.click(close_button);
        expect(mock.ui.toggleLinkExpiredModal).toBeCalledTimes(1);
        expect(mock.ui.toggleLinkExpiredModal).toHaveBeenCalledWith(false);
    });

    it('should call the verify email websocket API on clicking resend mail button', () => {
        // @ts-expect-error ignore this until find a way to make arguments as partial
        mockUseRequest.mockReturnValue({ isLoading: false });
        const mock = mockStore({ ui: { is_link_expired_modal_visible: true } });
        render(<LinkExpiredModal />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <StoreProvider store={mock}>{children}</StoreProvider>
                </APIProvider>
            ),
        });
        const resend_button = screen.getByRole('button', { name: /Resend email/ });
        fireEvent.change(screen.getByRole('textbox', { name: /Email address/i }), {
            target: { value: 'test.mail@domain.com' },
        });
        userEvent.click(resend_button);
        expect(mockUseRequest).toBeCalledWith('verify_email');
    });
});
