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

        expect(screen.getByText('Deriv P2P balance')).toBeInTheDocument();
        expect(
            screen.getByText('P2P deposits: Funds received from buying USD from another Deriv P2P user.')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Non-reversible deposits: Deposits from non-reversible payment methods.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Note: Funds deposited using reversible payment methods, like credit cards, Maestro, Diners Club, ZingPay, Skrill, Neteller, Ozow, and UPI QR will not appear in your P2P balance.'
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
