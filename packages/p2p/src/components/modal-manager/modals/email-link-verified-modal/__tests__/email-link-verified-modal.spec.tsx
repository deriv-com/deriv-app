import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import EmailLinkVerifiedModal from '../email-link-verified-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    order_store: {
        order_information: {
            advertiser_details: {
                name: 'John Doe',
            },
            amount_display: 100,
            is_buy_order_for_user: true,
            local_currency: 'USD',
            rate: 1.2,
        },
        confirmOrder: jest.fn(),
        setActionParam: jest.fn(),
        setVerificationCode: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const el_modal = document.createElement('div');

describe('<EmailLinkVerifiedModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render EmailLinkVerifiedModal', () => {
        render(<EmailLinkVerifiedModal />);

        expect(screen.getByText('One last step before we close this order')).toBeInTheDocument();
        expect(
            screen.getByText(
                'If you’ve received 120.00 USD from John Doe in your bank account or e-wallet, hit the button below to complete the order.'
            )
        ).toBeInTheDocument();
    });
    it('should handle confirm button click', () => {
        render(<EmailLinkVerifiedModal />);

        const confirm_button = screen.getByRole('button', { name: 'Confirm' });
        userEvent.click(confirm_button);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledWith({ should_hide_all_modals: true });
        expect(mock_store.order_store.confirmOrder).toHaveBeenCalledWith(true);
        expect(mock_store.order_store.setVerificationCode).toHaveBeenCalledWith('');
        expect(mock_store.order_store.setActionParam).toHaveBeenCalledWith(null);
    });
});
