import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QSInput from '../qs-input';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('<QSInput />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const onChange = jest.fn();
    beforeEach(() => {
        const mock_store = mockStore({
            ui: {
                is_mobile: true,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            duration: 1,
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik
                        initialValues={initial_value}
                        validationSchema={Yup.object().shape({
                            duration: Yup.number().min(1, 'Minimum value should be more than 0'),
                        })}
                        onSubmit={mock_onSubmit}
                    >
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

    it('should increase the value on click of + button', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const increase_button = screen.getByTestId('qs-input-increase');
        userEvent.click(increase_button);
        expect(onChange).toBeCalledWith('duration', '2');
    });

    it('should decrease the value on click of - button', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const decrease_button = screen.getByTestId('qs-input-decrease');
        userEvent.click(decrease_button);
        expect(onChange).toBeCalledWith('duration', '0');
    });

    it('should update the value', () => {
        render(<QSInput name='duration' type='number' onChange={onChange} />, {
            wrapper,
        });

        const input = screen.getByTestId('qs-input');
        userEvent.type(input, '5');
        expect(onChange).toBeCalledWith('duration', 15);
    });
});
