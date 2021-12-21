import React from 'react';
import Error from '../error';
import { fireEvent, render, screen } from '@testing-library/react';

describe('<Error />', () => {
    it('Should render an <Error /> component with "Email verification failed" header, if the error.code is equal to "InvalidToken"', () => {
        const error = {
            code: 'InvalidToken',
        };
        render(<Error error={error} />);
        expect(screen.getByText('Email verification failed')).toBeInTheDocument();
    });

    it('Should render a default-case of <Error /> component with "Oops, you have an error!" header if the error.code is equal to "empty_string"', () => {
        const error = {
            code: '',
            message: 'Oops, you have an error!',
        };
        render(<Error error={error} />);
        expect(screen.getByText('Oops, you have an error!')).toBeInTheDocument();
    });

    it('Should clear the error.message if onClickButton function is fired on <Error /> component', () => {
        const handleClcik = jest.fn();

        const error = {
            code: 'InvalidToken',
            setErrorMessage(value) {
                this.message = value;
            },
            onClickButton: handleClcik,
        };

        render(<Error error={error} />);
        expect(
            screen.getByText('The verification link you used is invalid or expired. Please request for a new one.')
        ).toBeInTheDocument();
        const error_btn = screen.getByRole('button');
        fireEvent.click(error_btn);
        expect(handleClcik).toHaveBeenCalledTimes(1);
        expect(error.message).toBe('');
    });
});
