import React from 'react';
import { Modal } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from '../../../constants';
import { AccountClosureSuccessModal } from '../AccountClosureSuccessModal';

describe('AccountClosureSuccessModal', () => {
    let elModalRoot: HTMLElement;

    const handleClose = jest.fn();

    beforeAll(() => {
        elModalRoot = document.createElement('div');
        elModalRoot.setAttribute('id', ACCOUNT_MODAL_REF.replace('#', ''));
        document.body.appendChild(elModalRoot);
        Modal.setAppElement(ACCOUNT_MODAL_REF);
    });

    afterAll(() => {
        document.body.removeChild(elModalRoot);
    });

    it('should render modal', () => {
        render(<AccountClosureSuccessModal handleClose={handleClose} isModalOpen={true} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText(/We're sorry to see you leave./i)).toBeInTheDocument();
        expect(screen.getByText(/Your account is now closed./i)).toBeInTheDocument();
    });

    it('should call handleClose when clicking escape button', () => {
        render(<AccountClosureSuccessModal handleClose={handleClose} isModalOpen={true} />);

        userEvent.keyboard('{esc}');
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
