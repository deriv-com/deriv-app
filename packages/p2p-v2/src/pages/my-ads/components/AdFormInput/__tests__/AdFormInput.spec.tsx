import React from 'react';
import { render, screen } from '@testing-library/react';
import AdFormInput from '../AdFormInput';

jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    Controller: ({ control, defaultValue, name, render }) =>
        render({
            field: { control, name, onBlur: jest.fn(), onChange: jest.fn(), value: defaultValue },
            fieldState: { error: null },
        }),
    useFormContext: () => ({
        control: 'mockedControl',
        getValues: jest.fn(),
    }),
}));

const mockProps = {
    currency: 'usd',
    label: 'label',
    name: 'name',
};

describe('AdFormInput', () => {
    it('should render the form input component', () => {
        render(<AdFormInput {...mockProps} />);
        expect(screen.getByText('label')).toBeInTheDocument();
    });
});
