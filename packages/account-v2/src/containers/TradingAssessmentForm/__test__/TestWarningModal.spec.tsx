import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestWarningModal } from '../TestWarningModal';

describe('TestWarningModal', () => {
    it('renders correctly with the modal open', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = true;

        render(<TestWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);

        expect(screen.getByText('Appropriateness Test Warning')).toBeInTheDocument();
        expect(
            screen.getByText(
                /In providing our services to you, we are required to ask you for some information to assess if a given/
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs/
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge/
            )
        ).toBeInTheDocument();

        const button = screen.getByRole('button', { name: 'OK' });
        expect(button).toBeInTheDocument();

        userEvent.click(button);

        expect(handleSubmit).toHaveBeenCalled();
    });

    it('does not render when the modal is closed', () => {
        const handleSubmit = jest.fn();
        const isModalOpen = false;

        render(<TestWarningModal handleSubmit={handleSubmit} isModalOpen={isModalOpen} />);

        expect(screen.queryByText('Appropriateness Test Warning')).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                /In providing our services to you, we are required to ask you for some information to assess if a given/
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                /Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs/
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText(
                /Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge/
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
    });
});
