import React from 'react';
import { Modal } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from '../../../constants';
import { TestWarningModal } from '../TestWarningModal';

describe('TestWarningModal', () => {
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

    const testWarningModalMessage = [
        /Appropriateness Test Warning/,
        /In providing our services to you, we are required to ask you for some information to assess if a given/,
        /Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs./,
        /Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge/,
    ];

    it('renders correctly with the modal open', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = true;

        render(<TestWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);
        testWarningModalMessage.forEach(message => expect(screen.getByText(message)).toBeInTheDocument());
        const button = screen.getByRole('button', { name: 'OK' });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(handleSubmit).toHaveBeenCalled();
    });

    it('does not render when the modal is closed', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = false;

        render(<TestWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);
        testWarningModalMessage.forEach(message => expect(screen.queryByText(message)).not.toBeInTheDocument());
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
});
