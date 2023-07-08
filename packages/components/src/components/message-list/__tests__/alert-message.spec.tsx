import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertMessage from '../alert-message';

describe('AlertMessage', () => {
    it('Should render proper icon type', () => {
        const { rerender } = render(<AlertMessage variant='base' type='error' message='' />);

        expect(screen.getByTestId('dt_IcWalletErrorMessageWithCross')).toBeInTheDocument();

        rerender(<AlertMessage variant='base' type='info' message='' />);

        expect(screen.getByTestId('dt_IcWalletInfoMessageWithThreeDots')).toBeInTheDocument();

        rerender(<AlertMessage variant='base' type='success' message='' />);

        expect(screen.getByTestId('dt_IcWalletSuccessMessage')).toBeInTheDocument();
    });

    it('Should render proper message', () => {
        render(<AlertMessage variant='base' type='error' message='Error message' />);

        expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('Should render proper button', () => {
        render(
            <AlertMessage
                variant='with-action-button'
                type='error'
                message='Error message'
                button_label='Error button'
                onClickHandler={jest.fn()}
            />
        );

        expect(screen.getByRole('button', { name: 'Error button' })).toBeInTheDocument();
    });

    it('Should trigger onClick handler when the user is clicking on the button', () => {
        const onClickHandler = jest.fn();

        render(
            <AlertMessage
                variant='with-action-button'
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
