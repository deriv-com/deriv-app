import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RiskToleranceWarningModal } from '../RiskToleranceWarningModal';

describe('RiskToleranceWarningModal', () => {
    it('should renders correctly with the modal open', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = true;

        render(<RiskToleranceWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);

        expect(screen.getByText('Risk Tolerance Warning')).toBeInTheDocument();

        expect(
            screen.getByText(
                /CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage/
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(/To continue, you must confirm that you understand your capital is at risk/)
        ).toBeInTheDocument();

        const button = screen.getByRole('button', { name: 'Yes, I understand the risk.' });
        expect(button).toBeInTheDocument();

        userEvent.click(button);

        expect(handleSubmit).toHaveBeenCalled();
    });

    it('should not render when the modal is closed', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = false;

        render(<RiskToleranceWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);

        expect(screen.queryByText('Risk Tolerance Warning')).not.toBeInTheDocument();
        expect(
            screen.queryByText(/CFDs and other financial instruments come with a high risk/)
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/To continue, you must confirm that you understand your capital is at risk/)
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Yes, I understand the risk.' })).not.toBeInTheDocument();
    });
});
