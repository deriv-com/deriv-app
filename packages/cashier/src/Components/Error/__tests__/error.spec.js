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
        const error = {
            code: 'WrongResponse',
            message: 'Something is wrong with your payment agent!!!',
            setErrorMessage(value) {
                this.message = value;
            },
        };
        render(<Error error={error} />);
        expect(screen.getByText(error.message)).toBeInTheDocument();
        expect(error.message).toBe('Something is wrong with your payment agent!!!');
        const error_btn = screen.getByRole('button');
        fireEvent.click(error_btn);
        expect(error.message).toBe('');
    });
});
