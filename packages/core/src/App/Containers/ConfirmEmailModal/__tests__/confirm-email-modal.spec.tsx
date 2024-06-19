import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { ConfirmEmailModal } from '../confirm-email-modal';

jest.mock('@deriv/account', () => ({
    ...jest.requireActual('@deriv/account'),
    SentEmailModal: jest.fn(({ onClose }) => (
        <div>
            SentEmailModal
            <button onClick={onClose}>Close</button>
        </div>
    )),
}));

jest.mock('Services', () => ({
    ...jest.requireActual('Services'),
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
        mock_props = {
            onClose: jest.fn(),
            changed_email: 'new_test@example.com',
            is_open: true,
            prev_email: 'test@example.com',
            setErrorMessage: jest.fn(),
            setEmailValue: jest.fn(),
        };
    });

    const mock_store = mockStore({});
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children};</StoreProvider>
    );

    const renderComponent = () => {
        render(<ConfirmEmailModal {...mock_props} />, { wrapper });
    };

    test('should not render ConfirmEmailModal if is_open is false', () => {
        mock_props.is_open = false;
        renderComponent();

        expect(screen.queryByText(/Are you sure?/i)).not.toBeInTheDocument();
    });

    test('should render ConfirmEmailModal and trigger closing', () => {
        renderComponent();

        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to update email/i)).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('new_test@example.com')).toBeInTheDocument();

        userEvent.keyboard('{Escape}');
        expect(mock_props.onClose).toHaveBeenCalledTimes(1);
    });

    // test('should render ConfirmEmailModal and trigger confirmation', async () => {
    //     renderComponent();
    //
    //     expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    //     expect(screen.getByText(/Are you sure you want to update email/i)).toBeInTheDocument();
    //     expect(screen.getByText('test@example.com')).toBeInTheDocument();
    //     expect(screen.getByText('new_test@example.com')).toBeInTheDocument();
    //
    //     userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    //
    //     await waitFor(() => {
    //         expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
    //         expect(screen.queryByText(/Are you sure you want to update email/i)).not.toBeInTheDocument();
    //         expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    //         expect(screen.queryByText('new_test@example.com')).not.toBeInTheDocument();
    //
    //         expect(screen.getByText('SentEmailModal')).toBeInTheDocument();
    //         expect(mock_store.client.setVerificationCode).toHaveBeenCalledTimes(1);
    //     });
    //     screen.debug();
    // });
});
