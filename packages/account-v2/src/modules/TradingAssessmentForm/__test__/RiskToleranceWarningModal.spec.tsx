import React from 'react';
import { Modal } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ACCOUNT_MODAL_REF } from '../../../constants';
import { RiskToleranceWarningModal } from '../RiskToleranceWarningModal';

describe('RiskToleranceWarningModal', () => {
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

    const riskToleranceModalMessage = [
        /Risk Tolerance Warning/,
        /CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage/,
        /To continue, you must confirm that you understand your capital is at risk/,
    ];

    it('should renders correctly with the modal open', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = true;

        render(<RiskToleranceWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);
        riskToleranceModalMessage.forEach(message => expect(screen.getByText(message)).toBeInTheDocument());
        const button = screen.getByRole('button', { name: 'Yes, I understand the risk.' });
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        expect(handleSubmit).toHaveBeenCalled();
    });

    it('should not render when the modal is closed', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = false;

        render(<RiskToleranceWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);
        riskToleranceModalMessage.forEach(message => expect(screen.queryByText(message)).not.toBeInTheDocument());
        expect(screen.queryByRole('button', { name: 'Yes, I understand the risk.' })).not.toBeInTheDocument();
    });
});
