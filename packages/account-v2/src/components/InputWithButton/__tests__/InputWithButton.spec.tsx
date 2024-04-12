import React from 'react';
import { Formik } from 'formik';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputWithButton } from '../InputWithButton';

describe('InputWithButton', () => {
    it('should render the InputWithButton component', () => {
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <InputWithButton buttonText='Enable' label='Authentication code' name='digitCode' />
            </Formik>
        );
        expect(screen.getByLabelText('Authentication code')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument();
    });
    it('should handle onClick when the button is clicked', () => {
        const mockHandleClick = jest.fn();
        render(
            <Formik initialValues={{}} onSubmit={jest.fn()}>
                <InputWithButton
                    buttonText='Enable'
                    label='Authentication code'
                    name='digitCode'
                    onClick={mockHandleClick}
                />
            </Formik>
        );
        const button = screen.getByRole('button', { name: 'Enable' });
        userEvent.click(button);
        expect(screen.getByRole('button', { name: 'Enable' })).toBeInTheDocument();
        expect(mockHandleClick).toHaveBeenCalled();
    });
});
