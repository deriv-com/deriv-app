import React from 'react';
import { render, screen } from '@testing-library/react';
import AdFormTextArea from '../AdFormTextArea';

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
    field: 'field',
    hint: 'this is the hint',
    label: 'label',
    name: 'name',
    required: true,
};

describe('AdFormTextArea', () => {
    it('should render the form text area component', () => {
        render(<AdFormTextArea {...mockProps} />);
        expect(screen.getByText('this is the hint')).toBeInTheDocument();
    });
});
