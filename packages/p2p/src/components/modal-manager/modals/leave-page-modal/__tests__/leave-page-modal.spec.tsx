import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import LeavePageModal from '../leave-page-modal';

const mock_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        setShowFilterPaymentMethods: jest.fn(),
    },
};
const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store_values),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager,
}));

describe('<LeavePageModal/>', () => {
    let el_modal: HTMLElement;

    beforeAll(() => {
        el_modal = document.createElement('div');
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render LeavePageModal with given props', () => {
        const props = {
            onCancel: jest.fn(),
            onLeavePage: jest.fn(),
        };

        render(<LeavePageModal {...props} />);

        expect(screen.getByText('If you leave this page, your unsaved changes will be lost.')).toBeInTheDocument();
    });

    it('should call onLeavePage and close the modal on click of Leave page button', () => {
        const props = {
            onLeavePage: jest.fn(),
        };

        render(<LeavePageModal {...props} />);

        const leave_page_button = screen.getByRole('button', { name: 'Leave page' });
        userEvent.click(leave_page_button);
        expect(props.onLeavePage).toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_store_values.buy_sell_store.setShowFilterPaymentMethods).toHaveBeenCalledWith(false);
    });

    it('should call onCancel and close the modal on click of Cancel button', () => {
        const props = {
            onCancel: jest.fn(),
        };

        render(<LeavePageModal {...props} />);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);
        expect(props.onCancel).toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
});
