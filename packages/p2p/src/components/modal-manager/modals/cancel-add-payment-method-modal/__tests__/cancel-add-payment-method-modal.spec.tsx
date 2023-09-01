import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import CancelAddPaymentMethodModal from '../cancel-add-payment-method-modal';

const mock_modal_manager_context: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

const mock_stores = {
    my_ads_store: {
        setShouldShowAddPaymentMethod: jest.fn(),
    },
    my_profile_store: {
        hideAddPaymentMethodForm: jest.fn(),
        setSelectedPaymentMethod: jest.fn(),
    },
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: () => mock_modal_manager_context,
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_stores,
}));

describe('<CancelAddPaymentMethodModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render <CancelAddPaymentMethodModal /> component', () => {
        render(<CancelAddPaymentMethodModal />);
        expect(screen.getByText('Cancel adding this payment method?')).toBeInTheDocument();
        expect(
            screen.getByText('If you choose to cancel, the details you’ve entered will be lost.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
    });

    it('should hide modal and clear the form when clicking on cancel button', () => {
        const mock_on_cancel = jest.fn();
        render(<CancelAddPaymentMethodModal onCancel={mock_on_cancel} should_hide_all_modals_on_cancel />);
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);

        const { hideAddPaymentMethodForm, setSelectedPaymentMethod } = mock_stores.my_profile_store;
        const { setShouldShowAddPaymentMethod } = mock_stores.my_ads_store;

        expect(hideAddPaymentMethodForm).toHaveBeenCalled();
        expect(setSelectedPaymentMethod).toHaveBeenCalledWith('');
        expect(setShouldShowAddPaymentMethod).toHaveBeenCalledWith(false);
        expect(mock_on_cancel).toHaveBeenCalled();
        expect(mock_modal_manager_context.hideModal).toHaveBeenCalledWith({
            should_save_form_history: false,
            should_hide_all_modals: true,
            should_restore_local_state: false,
        });
    });

    it('should cancel adding payment method without hiding all modals', () => {
        render(<CancelAddPaymentMethodModal />);
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);

        expect(mock_modal_manager_context.hideModal).toHaveBeenCalledWith({
            should_save_form_history: false,
            should_hide_all_modals: false,
            should_restore_local_state: false,
        });
    });

    it('should hide modal when clicking on go back button', () => {
        render(<CancelAddPaymentMethodModal />);
        const go_back_button = screen.getByRole('button', { name: 'Go back' });
        userEvent.click(go_back_button);

        expect(mock_modal_manager_context.hideModal).toHaveBeenCalledWith({
            should_save_form_history: true,
            should_restore_local_state: true,
        });
    });
});
