import React from 'react';
import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import PaymentMethodField from '../PaymentMethodField';

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({ control, defaultValue, name, render }) =>
        render({
            field: { control, name, onBlur: jest.fn(), onChange: jest.fn(), value: defaultValue },
            fieldState: { error: null },
        }),
    useForm: () => ({
        control: 'mockedControl',
    }),
}));

const mockUseForm = useForm as jest.MockedFunction<typeof useForm>;

describe('PaymentMethodField', () => {
    const { control } = mockUseForm();
    it('should render a textarea when the field prop is set to instructions', () => {
        render(<PaymentMethodField control={control} defaultValue='' displayName='textarea' field='instructions' />);
        expect(screen.getByText('textarea')).toBeInTheDocument();
    });
    it('should render an input when the field prop is set to text', () => {
        render(<PaymentMethodField control={control} defaultValue='' displayName='input' field='text' required />);
        expect(screen.getByPlaceholderText('input')).toBeInTheDocument();
    });
});
