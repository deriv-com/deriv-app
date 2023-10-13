import React from 'react';
import { render, screen } from '@testing-library/react';
import FormSelectField from '../form-select-field';
import { StoreProvider, mockStore } from '@deriv/stores';
import { Formik } from 'formik';
import userEvent from '@testing-library/user-event';

describe('FormSelectField', () => {
    const list_items = [
        { value: '1', text: 'Option 1' },
        { value: '2', text: 'Option 2' },
        { value: '3', text: 'Option 3' },
    ];
    const mock_store = mockStore({});

    it('should render label', () => {
        render(
            <StoreProvider store={mock_store}>
                <Formik
                    initialValues={{
                        test_name: '',
                    }}
                    onSubmit={jest.fn()}
                >
                    <FormSelectField required label='Test Label' name='test_name' list_items={list_items} />
                </Formik>
            </StoreProvider>
        );
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should render and select an option', async () => {
        render(
            <StoreProvider store={mock_store}>
                <Formik
                    initialValues={{
                        test_name: '',
                    }}
                    onSubmit={jest.fn()}
                >
                    <FormSelectField required label='Test Label' name='test_name' list_items={list_items} />
                </Formik>
            </StoreProvider>
        );

        const select_element = screen.getByLabelText('Test Label');
        userEvent.type(select_element, '{arrowdown}{arrowdown}{enter}');

        // Verify that Option 2 is selected
        expect(select_element).toHaveValue('Option 2');
    });

    it('should render error message for invalid input', async () => {
        render(
            <StoreProvider store={mock_store}>
                <Formik
                    initialValues={{
                        test_name: '',
                    }}
                    initialErrors={{
                        test_name: 'This field is required',
                    }}
                    initialTouched={{
                        test_name: true,
                    }}
                    onSubmit={jest.fn()}
                >
                    <FormSelectField required label='Test Label' name='test_name' list_items={list_items} />
                </Formik>
            </StoreProvider>
        );

        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
});
