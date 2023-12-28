import React from 'react';
import Yup from 'yup';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlowProvider } from '../../FlowProvider';
import FlowTextField from '../FlowTextField';

const mockUseFlow = {
    setFormValues: jest.fn(),
};
jest.mock('../../FlowProvider', () => ({
    ...jest.requireActual('../../FlowProvider'),
    useFlow: jest.fn(() => mockUseFlow),
}));

const mockValidate = jest.fn();
jest.mock('yup', () => ({
    ...jest.requireActual('yup'),
    string: () => ({
        required: () => ({
            validateSync: mockValidate,
        }),
    }),
}));

describe('FlowTextField', () => {
    it('should set field value with default value provided', () => {
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <FlowTextField defaultValue='default' name='test' />}
            </FlowProvider>
        );
        expect(screen.getByDisplayValue('default')).toBeInTheDocument();
        expect(mockUseFlow.setFormValues).toHaveBeenCalledWith('test', 'default');
    });

    it('should set hasTouched value when user is on focus', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        const mockSetHasTouched = jest.fn();
        (mockUseState as jest.Mock).mockImplementation(initialValue => [initialValue, mockSetHasTouched]);
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <FlowTextField defaultValue='default' name='test' />}
            </FlowProvider>
        );
        const input = screen.getByDisplayValue('default');
        input.focus();
        expect(mockSetHasTouched).toHaveBeenCalled();
    });

    it('should validate field when user typing', () => {
        const validationSchema = Yup.string().required();
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <FlowTextField defaultValue='default' name='test' validationSchema={validationSchema} />}
            </FlowProvider>
        );
        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(mockValidate).toHaveBeenCalled();
        expect(input).toHaveValue('defaulttest');
    });

    it('should catch error when trying to validate field', () => {
        const validationSchema = Yup.string().required();
        mockValidate.mockImplementation(() => {
            throw new Yup.ValidationError('error', 'test', 'test');
        });
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <FlowTextField defaultValue='default' name='test' validationSchema={validationSchema} />}
            </FlowProvider>
        );
        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(mockValidate).toHaveBeenCalled();
    });

    it('should show error message when field is invalid', () => {
        const mockUseState = jest.spyOn(React, 'useState');
        const mockSetTouched = jest.fn();
        (mockUseState as jest.Mock).mockImplementation(initialValue => [initialValue, mockSetTouched]);

        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <FlowTextField defaultValue='default' errorMessage='Field is required' isInvalid name='test' />}
            </FlowProvider>
        );
        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(screen.getByText('Field is required')).toBeInTheDocument();
    });

    it('should not allow user to type when field is disabled', () => {
        render(
            <FlowProvider
                initialValues={{
                    test: 'default',
                }}
                screens={{
                    test: <FlowTextField name='test' />,
                }}
            >
                {() => <FlowTextField defaultValue='default' disabled name='test' />}
            </FlowProvider>
        );
        const input = screen.getByDisplayValue('default');
        userEvent.type(input, 'test');
        expect(input).toHaveValue('default');
    });
});
