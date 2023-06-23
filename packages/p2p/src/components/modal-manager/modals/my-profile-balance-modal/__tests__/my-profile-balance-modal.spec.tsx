import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import MyProfileBalanceModal from '../my-profile-balance-modal';

const el_modal = document.createElement('div');

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => ({
        hideModal: jest.fn(),
        is_modal_open: true,
    })),
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

        expect(screen.getByText('Deriv P2P Balance')).toBeInTheDocument();
    });

    it('should call hideModal when clicking on the OK button', () => {
        const hideModalMock = jest.fn();

        (useModalManagerContext as jest.Mock).mockImplementation(() => ({
            hideModal: hideModalMock,
            is_modal_open: true,
        }));

        render(<MyProfileBalanceModal />);

        const okButton = screen.getByRole('button', { name: 'OK' });

        userEvent.click(okButton);

        expect(hideModalMock).toHaveBeenCalledTimes(1);
    });
});
