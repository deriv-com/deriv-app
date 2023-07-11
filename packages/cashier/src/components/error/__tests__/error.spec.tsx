import React from 'react';
import Error from '../error';
import { fireEvent, render, screen } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';

describe('<Error />', () => {
    it('should show the "Email verification failed" message, and "Resend email" button', () => {
        const error = {
            code: 'InvalidToken',
            fields: '',
            message: '',
            onClickButton: jest.fn(),
            setErrorMessage: jest.fn(),
        };
        render(<Error error={error} />);
        expect(screen.getByText('Email verification failed')).toBeInTheDocument();

        expect(screen.getByText('Resend email')).toBeInTheDocument();
    });

    it('should show the "Update your personal details" message, and "Update my details" button', () => {
        const history = createBrowserHistory();
        const error = {
            code: 'ASK_FIX_DETAILS',
            fields: '',
            message: '',
            onClickButton: jest.fn(),
            setErrorMessage: jest.fn(),
        };
        render(
            <Router history={history}>
                <Error error={error} />
            </Router>
        );

        expect(screen.getByText('Update your personal details')).toBeInTheDocument();
        expect(screen.getByText('Update my details')).toBeInTheDocument();
    });

    it('should show the "Oops, you have an error!" message, and "Try again" button', () => {
        const error = {
            code: 'WrongResponse',
            message: 'Oops, you have an error!',
            fields: '',
            onClickButton: jest.fn(),
            setErrorMessage: jest.fn(),
        };
        render(<Error error={error} />);

        expect(screen.getByText('Oops, you have an error!')).toBeInTheDocument();
        expect(screen.getByText('Try again')).toBeInTheDocument();
    });

    it('should show the "Oops, you have an error with withdrawal!" message', () => {
        const error = {
            code: 'PaymentAgentWithdrawError',
            message: 'Oops, you have an error with withdrawal!',
            fields: '',
            onClickButton: jest.fn(),
            setErrorMessage: jest.fn(),
        };
        render(<Error error={error} />);

        expect(screen.getByText('Oops, you have an error with withdrawal!')).toBeInTheDocument();
    });

    it('should show the "Default error" message', () => {
        const error = {
            code: '',
            message: 'Default error',
            fields: '',
            onClickButton: jest.fn(),
            setErrorMessage: jest.fn(),
        };
        render(<Error error={error} />);

        expect(screen.getByText('Default error')).toBeInTheDocument();
    });

    it('should clear an error.message if one of the buttons ["Resend email", "Update my details", "Try again"] was clicked', () => {
        const checkButton = (btn_name: string, error_code: string) => {
            const history = createBrowserHistory();
            const error = {
                code: error_code,
                fields: '',
                setErrorMessage({ code, message }: { code: string; message: string }) {
                    this.message = message;
                },
                message: '',
                onClickButton: jest.fn(),
            };
            const { unmount } = render(
                <Router history={history}>
                    <Error error={error} />
                </Router>
            );
            const error_btn = screen.getByText(btn_name);
            fireEvent.click(error_btn);

            expect(error.message).toBe('');

            unmount();
        };

        checkButton('Resend email', 'InvalidToken');
        checkButton('Try again', 'WrongResponse');
        checkButton('Update my details', 'ASK_FIX_DETAILS');
    });
});
