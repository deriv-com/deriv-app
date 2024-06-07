import React from 'react';
import { Modal } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from 'src/constants';
import { MaskCardModal } from '../MaskCardModal';

describe('MaskCardModal', () => {
    let elModalRoot: HTMLElement;

    beforeAll(() => {
        elModalRoot = document.createElement('div');
        elModalRoot.setAttribute('id', ACCOUNT_MODAL_REF.replace('#', ''));
        document.body.appendChild(elModalRoot);
        Modal.setAppElement(ACCOUNT_MODAL_REF);
    });

    afterAll(() => {
        document.body.removeChild(elModalRoot);
    });

    it('should render correctly with the modal open', () => {
        const isOpen = true;
        const onClose = jest.fn();

        render(<MaskCardModal isOpen={isOpen} onClose={onClose} />);

        expect(screen.getByText('How to mask your card?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Black out digits 7 to 12 of the card number that’s shown on the front of your debit/credit card.⁤'
            )
        ).toBeInTheDocument();
    });

    it('should close the modal when close icon is clicked', () => {
        const isOpen = true;
        const onClose = jest.fn();

        render(<MaskCardModal isOpen={isOpen} onClose={onClose} />);

        const elCloseIcon = screen.getByTestId('dt-close-icon');
        userEvent.click(elCloseIcon);

        expect(onClose).toHaveBeenCalled();
    });
});
