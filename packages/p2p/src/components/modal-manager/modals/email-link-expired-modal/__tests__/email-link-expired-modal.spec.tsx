import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import EmailLinkExpiredModal from '../email-link-expired-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    order_store: {
        confirmOrderRequest: jest.fn(),
        order_information: {
            id: '1',
        },
    },
};

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};
const el_modal = document.createElement('div');

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<EmailLinkExpiredModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the EmailLinKExpiredModal', () => {
        render(<EmailLinkExpiredModal />);

        expect(
            screen.getByText(
                /The verification link appears to be invalid. Hit the button below to request for a new one/
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get new link' })).toBeInTheDocument();
    });

    it('should call hideModal and confirmOrderRequest when clicking on button', () => {
        render(<EmailLinkExpiredModal />);

        const getNewLinkButton = screen.getByRole('button', { name: 'Get new link' });

        userEvent.click(getNewLinkButton);

        expect(mock_modal_manager.hideModal).toBeCalledWith({ should_hide_all_modals: true });
        expect(mock_store.order_store.confirmOrderRequest).toBeCalledWith('1');
    });

    it('should call hideModal when toggling the modal', () => {
        render(<EmailLinkExpiredModal />);

        const closeIcon = screen.getByTestId('dt_modal_close_icon');

        userEvent.click(closeIcon);

        expect(mock_modal_manager.hideModal).toBeCalledWith({ should_hide_all_modals: true });
    });
});
