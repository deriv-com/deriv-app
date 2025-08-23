import React, { ComponentProps } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormDropdown from '../FormDropdown';

jest.mock('@deriv-com/ui', () => ({
    Dropdown: jest.fn(({ list, onBlur, onSearch, onSelect, ...props }) => {
        return (
            <>
                {list.map((item: { text: string; value: string }) => {
                    return (
                        <div data-testid={`dt_${props.name}`} key={item.value} {...props}>
                            <input onBlur={onBlur} onChange={e => onSearch(e.target.value)} placeholder='Search...' />
                            <button onClick={() => onSelect(item.value)}>Select {item.text}</button>
                        </div>
                    );
                })}
            </>
        );
    }),
}));

const setup = (props: ComponentProps<typeof FormDropdown>) => {
    return render(
        <Formik initialValues={{ [props.name || 'test']: '' }} onSubmit={jest.fn()}>
            <FormDropdown {...props} />
        </Formik>
    );
};
describe('FormDropdown', () => {
    test('renders FormDropdown correctly', () => {
        setup({ list: [{ text: 'Option 1', value: 'option1' }], name: 'test' });

        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    test('applies validation schema', async () => {
        const validationSchema = Yup.string().required('Required');

        setup({ list: [{ text: 'Option 1', value: 'option1' }], name: 'test', validationSchema });

        await userEvent.click(screen.getByText('Select Option 1'));

        await waitFor(() => {
            expect(screen.queryByText('Required')).not.toBeInTheDocument();
        });
    });

    test('handles search and select for combobox variant', async () => {
        const onSelectMock = jest.fn();
        const onSearchMock = jest.fn();

        setup({
            list: [{ text: 'Option 1', value: 'option1' }],
            name: 'test',
            onSearch: onSearchMock,
            onSelect: onSelectMock,
            variant: 'comboBox',
        });
        await userEvent.type(screen.getByPlaceholderText('Search...'), 'Option 1');
        await userEvent.tab();
        await userEvent.click(screen.getByText('Select Option 1'));

        expect(onSearchMock).toHaveBeenCalledWith('Option 1');
        expect(onSelectMock).toHaveBeenCalledWith('option1');
    });
    test('handles search and select for prompt variant', async () => {
        const onSelectMock = jest.fn();
        const onSearchMock = jest.fn();

        setup({
            list: [{ text: 'Option 1', value: 'option1' }],
            name: 'test',
            onSearch: onSearchMock,
            onSelect: onSelectMock,
            variant: 'prompt',
        });
        await userEvent.type(screen.getByPlaceholderText('Search...'), 'Option 1');
        await userEvent.tab();
        await userEvent.click(screen.getByText('Select Option 1'));

        expect(onSearchMock).toHaveBeenCalledWith('Option 1');
        expect(onSelectMock).toHaveBeenCalledWith('option1');
    });

    test('shows error message when field is invalid', async () => {
        const validationSchema = Yup.string().nullable().required('Required');

        setup({ list: [{ text: 'Option 1', value: '' }], name: 'test', validationSchema });

        await userEvent.type(screen.getByPlaceholderText('Search...'), 'Option 1');
        await userEvent.click(screen.getByText('Select Option 1'));

        await waitFor(() => {
            expect(screen.getByTestId('dt_test')).toHaveAttribute('errormessage', 'Required');
        });
    });
});
