import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QSInput from '../qs-input';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<QSInput />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const onChange = jest.fn();

    const mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();

        const initial_value = {
            duration: 1,
            size: 5.1789,
            loss: 999999999999,
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik initialValues={initial_value} onSubmit={mock_onSubmit}>
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render QSInput', () => {
        const { container } = render(<QSInput onChange={onChange} name='duration' />, {
            wrapper,
        });

        expect(container).toBeInTheDocument();
    });

    it('should increase the value on click of "+" button', () => {
        mock_store.ui.is_mobile = false;
        render(<QSInput name='duration' type='number' has_currency_unit onChange={onChange} />, {
            wrapper,
        });

        const increase_button = screen.getByTestId('dt_qs_input_increase');
        userEvent.click(increase_button);

        const input_increase = screen.getByTestId('dt_qs_duration') as HTMLInputElement;
        const input_value = input_increase.value;
        expect(input_value).toEqual('2');
    });

    it('should decrease the value on click of "-" button', () => {
        mock_store.ui.is_mobile = false;
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const decrease_button = screen.getByTestId('dt_qs_input_decrease');
        userEvent.click(decrease_button);

        const input_decrease = screen.getByTestId('dt_qs_duration') as HTMLInputElement;
        const input_value = input_decrease.value;

        expect(input_value).toEqual('0');
    });

    it('the onMouseLeave handler sets the focus to false', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const container_element = screen.getByTestId('dt_qs_input_container');
        userEvent.unhover(container_element);

        expect(container_element).not.toHaveClass('no-focus');
    });

    it('the onMouseEnter handler sets the focus to false if the error or focus on element is absent ', () => {
        mock_store.ui.is_mobile = false;
        render(<QSInput name='duration' type='number' min={100} onChange={onChange} />, {
            wrapper,
        });

        const container_element = screen.getByTestId('dt_qs_input_container');
        userEvent.type(container_element, '{enter}');

        expect(container_element).not.toHaveClass('no-focus');
    });

    it('the decrease should round a decimal number to two decimal places', () => {
        render(<QSInput name='size' type='number' onChange={onChange} />, {
            wrapper,
        });

        const btn_element = screen.getByTestId('dt_qs_input_decrease');
        userEvent.click(btn_element);

        const input_decrease = screen.getByTestId('dt_qs_size') as HTMLInputElement;
        const input_value = input_decrease.value;
        expect(input_value).toEqual('4.18');
    });

    it('the increase icon should round a decimal number to two decimal places', () => {
        render(<QSInput name='size' type='number' max={7} onChange={onChange} />, {
            wrapper,
        });

        const btn_element = screen.getByTestId('dt_qs_input_increase');
        userEvent.click(btn_element);

        const input_decrease = screen.getByTestId('dt_qs_size') as HTMLInputElement;
        const input_value = input_decrease.value;
        expect(input_value).toEqual('6.18');
    });

    it('should be able to call handleOnChange() when type equals number and display the same number', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });
        const input_element = screen.getByTestId('dt_qs_duration');
        userEvent.type(input_element, '1');
        expect(input_element).toHaveDisplayValue(['1']);
    });

    it('should be able to call handleOnChange() when type equals text by default and display default number', () => {
        render(<QSInput name='duration' onChange={onChange} />, {
            wrapper,
        });
        const input_element = screen.getByTestId('dt_qs_duration');
        userEvent.type(input_element, 'a');
        expect(input_element).toHaveDisplayValue(['1']);
    });

    it('should display a number of not more than 12 digits and be able to call handleOnChange() when type equals number, max length equals or more than 12', () => {
        render(<QSInput name='loss' type='number' onChange={onChange} />, {
            wrapper,
        });
        const input_element = screen.getByTestId('dt_qs_loss');
        userEvent.type(input_element, '9');
        expect(input_element).toHaveDisplayValue(['999999999999']);
    });
});
