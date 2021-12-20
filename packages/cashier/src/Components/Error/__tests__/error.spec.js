import React from 'react';
import Error from '../error';
import { render, fireEvent } from '@testing-library/react';

it('Should render an <Error /> component with "Email verification failed" header, if the error.code is equal to "InvalidToken"', () => {
    const error = {
        code: 'InvalidToken',
    };
    const screen = render(<Error error={error} />);
    expect(screen.getByText('Email verification failed')).not.toBe(null);
});

it('Should render a default-case of <Error /> component with "Oops, you have an error!" header if the error.code is equal to "empty_string"', () => {
    const error = {
        code: '',
        message: 'Oops, you have an error!',
    };
    const screen = render(<Error error={error} />);
    expect(screen.getByText('Oops, you have an error!')).not.toBe(null);
});

it('Should clear the error.message if onClickButton function is fired on <Error /> component', () => {
    const error = {
        code: 'InvalidToken',
        setErrorMessage(value) {
            this.message = value;
        },
    };
    render(<Error error={error} />);
    const error_btn = document.querySelector('.error__button');
    fireEvent.click(error_btn);
    expect(error.message).toBe('');
});
