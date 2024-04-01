import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import EmailLinkedBlockedModal from '../email-link-blocked-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    order_store: {
        setIsVerifyingEmail: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

const mock_props = {
    email_link_blocked_modal_error_message: 'this is the error message',
};

describe('<EmailLinkedBlockedModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render EmailLinkedBlockedModal with the given error message', () => {
        render(<EmailLinkedBlockedModal {...mock_props} />);

        expect(screen.getByText('Too many failed attempts')).toBeInTheDocument();
        expect(screen.getByText('this is the error message')).toBeInTheDocument();
    });
    it('should handle close modal', () => {
        render(<EmailLinkedBlockedModal {...mock_props} />);

        const close_icon = screen.getByTestId('dt_modal_close_icon');
        expect(close_icon).toBeInTheDocument();
        userEvent.click(close_icon);
        expect(mock_modal_manager.hideModal).toBeCalledTimes(1);
        expect(mock_store.order_store.setIsVerifyingEmail).toBeCalledTimes(1);
    });
});
