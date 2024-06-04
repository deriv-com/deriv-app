import React from 'react';
import { Modal } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from '../../../constants';
import { AccountClosureConfirmModal } from '../AccountClosureConfirmModal';

describe('AccountClosureConfirmModal', () => {
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

    const handleCancel = jest.fn();
    const handleSubmit = jest.fn();

    it('should render modal', () => {
        render(
            <AccountClosureConfirmModal handleCancel={handleCancel} handleSubmit={handleSubmit} isModalOpen={true} />
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Go back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Close account/i })).toBeInTheDocument();
    });

    it('should call handleCancel when clicking Go back', () => {
        render(
            <AccountClosureConfirmModal handleCancel={handleCancel} handleSubmit={handleSubmit} isModalOpen={true} />
        );

        const goBackButton = screen.getByRole('button', { name: /Go back/i });
        userEvent.click(goBackButton);

        expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('should call handleSubmit when clicking Close account', () => {
        render(
            <AccountClosureConfirmModal handleCancel={handleCancel} handleSubmit={handleSubmit} isModalOpen={true} />
        );

        const closeAccountButton = screen.getByRole('button', { name: /Close account/i });
        userEvent.click(closeAccountButton);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should  not call handleCancel when clicking escape button', () => {
        render(
            <AccountClosureConfirmModal handleCancel={handleCancel} handleSubmit={handleSubmit} isModalOpen={true} />
        );

        userEvent.keyboard('{esc}');

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
});
