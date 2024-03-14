import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileBalanceModal from '../my-profile-balance-modal';

const el_modal = document.createElement('div');

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<MyProfileBalanceModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render MyProfileBalanceModal', () => {
        render(<MyProfileBalanceModal />);

        expect(screen.getByText('Available Deriv P2P Balance')).toBeInTheDocument();
        expect(
            screen.getByText('Your Deriv P2P balance only includes deposits that can’t be reversed.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Deposits via cards and the following payment methods aren’t included: Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR.'
            )
        ).toBeInTheDocument();
    });

    it('should call hideModal when clicking on the OK button', () => {
        render(<MyProfileBalanceModal />);

        const okButton = screen.getByRole('button', { name: 'OK' });

        userEvent.click(okButton);

        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
});
