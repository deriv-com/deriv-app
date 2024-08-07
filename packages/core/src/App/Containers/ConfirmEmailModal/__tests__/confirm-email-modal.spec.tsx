import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { WS } from '@deriv/shared';
import { ConfirmEmailModal } from '../confirm-email-modal';

jest.mock('@deriv/account/src/Components/sent-email-modal', () =>
    jest.fn(({ onClose, onClickSendEmail }) => (
        <div>
            SentEmailModal
            <button onClick={onClose}>Close</button>
            <button onClick={onClickSendEmail}>ClickSendEmail</button>
        </div>
    ))
);

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        changeEmail: jest.fn(() => Promise.resolve({})),
    },
}));

describe('ConfirmEmailModal', () => {
    let modal_root_el: HTMLElement, mock_props: React.ComponentProps<typeof ConfirmEmailModal>;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mock_props = {
            onClose: jest.fn(),
            changed_email: 'new_test@example.com',
            is_open: true,
            prev_email: 'test@example.com',
            setErrorMessage: jest.fn(),
            setEmailValue: jest.fn(),
        };
    });

    const modal_text_content = [
        'Are you sure?',
        /Are you sure you want to update email/i,
        'test@example.com',
        'new_test@example.com',
    ];

    const mock_store = mockStore({});
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children};</StoreProvider>
    );
    const renderComponent = () => {
        render(<ConfirmEmailModal {...mock_props} />, { wrapper });
    };

    it('should not render ConfirmEmailModal if is_open is false', () => {
        mock_props.is_open = false;
        renderComponent();

        modal_text_content.forEach(text => expect(screen.queryByText(text)).not.toBeInTheDocument());
    });

    it('should render ConfirmEmailModal and trigger closing', () => {
        renderComponent();

        modal_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());

        userEvent.keyboard('{Escape}');
        expect(mock_props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should render ConfirmEmailModal, trigger confirmation modal and close it', async () => {
        renderComponent();

        modal_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());

        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        await waitFor(() => {
            modal_text_content.forEach(text => expect(screen.queryByText(text)).not.toBeInTheDocument());
            expect(screen.getByText('SentEmailModal')).toBeInTheDocument();
            expect(mock_store.client.setVerificationCode).toHaveBeenCalledTimes(1);
        });

        userEvent.click(screen.getByText('Close'));
        modal_text_content.forEach(text => expect(screen.queryByText(text)).not.toBeInTheDocument());
        expect(screen.queryByText('SentEmailModal')).not.toBeInTheDocument();
    });

    it('should render ConfirmEmailModal, trigger confirmation modal and confirm', async () => {
        renderComponent();

        modal_text_content.forEach(text => expect(screen.getByText(text)).toBeInTheDocument());

        userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        expect(WS.changeEmail).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            modal_text_content.forEach(text => expect(screen.queryByText(text)).not.toBeInTheDocument());
            expect(screen.getByText('SentEmailModal')).toBeInTheDocument();
        });

        userEvent.click(screen.getByText('ClickSendEmail'));
        expect(WS.changeEmail).toHaveBeenCalledTimes(2);
    });
});
