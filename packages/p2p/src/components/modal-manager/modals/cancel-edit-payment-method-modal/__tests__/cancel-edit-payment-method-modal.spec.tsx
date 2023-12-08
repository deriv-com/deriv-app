import React from 'react';
import { render, screen } from '@testing-library/react';
import CancelEditPaymentMethodModal from '../cancel-edit-payment-method-modal';

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

const mock_my_profile_store = {
    setPaymentMethodToEdit: jest.fn(),
    setShouldShowEditPaymentMethodForm: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager,
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => ({
        my_profile_store: mock_my_profile_store,
    }),
}));

describe('<CancelEditPaymentMethodModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render <CancelEditPaymentMethodModal /> component', () => {
        render(<CancelEditPaymentMethodModal />);
        expect(screen.getByText('Cancel your edits?')).toBeInTheDocument();
        expect(screen.getByText('If you choose to cancel, the edited details will be lost.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Don't cancel" })).toBeInTheDocument();
    });

    it('should cancel edits when clicking on cancel button', () => {
        render(<CancelEditPaymentMethodModal />);
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        cancel_button.click();
        expect(mock_my_profile_store.setPaymentMethodToEdit).toHaveBeenCalled();
        expect(mock_my_profile_store.setShouldShowEditPaymentMethodForm).toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should not cancel edits when clicking on dont cancel button', () => {
        render(<CancelEditPaymentMethodModal />);
        const dont_cancel_button = screen.getByRole('button', { name: "Don't cancel" });
        dont_cancel_button.click();
        expect(mock_my_profile_store.setPaymentMethodToEdit).not.toHaveBeenCalled();
        expect(mock_my_profile_store.setShouldShowEditPaymentMethodForm).not.toHaveBeenCalled();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
});
