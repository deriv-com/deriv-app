import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertMessage from '../alert-message';

describe('AlertMessage', () => {
    it('Should proper icon type', () => {
        const { rerender } = render(<AlertMessage type='error' message='' />);

        expect(screen.getByTestId('dt_IcWalletErrorMessageWithCross')).toBeInTheDocument();

        rerender(<AlertMessage type='info' message='' />);

        expect(screen.getByTestId('dt_IcWalletInfoMessageWithThreeDots')).toBeInTheDocument();

        rerender(<AlertMessage type='success' message='' />);

        expect(screen.getByTestId('dt_IcWalletSuccessMessage')).toBeInTheDocument();
    });

    it('Should render proper message', () => {
        render(<AlertMessage type='error' message='Error message' />);

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('Should render proper button', () => {
        render(<AlertMessage type='error' message='Error message' button_label='Error button' />);

        expect(screen.getByRole('button', { name: 'Error button' })).toBeInTheDocument();
    });

    it('Should trigger onClick handler when the user is clicking on the button', () => {
        const onClickHandler = jest.fn();

        render(
            <AlertMessage
                type='error'
                message='Error message'
                button_label='Error button'
                onClickHandler={onClickHandler}
            />
        );

        const el_btn = screen.getByRole('button', { name: 'Error button' });
        userEvent.click(el_btn);

        expect(onClickHandler).toHaveBeenCalledTimes(1);
    });
});
