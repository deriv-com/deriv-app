import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ApiHelpers } from '@deriv/bot-skeleton';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DurationUnit from '../duration-type';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    ApiHelpers: {
        instance: {
            contracts_for: {
                getDurations: () => [
                    {
                        display: 'Ticks',
                        unit: 't',
                        min: 1,
                        max: 10,
                    },
                    {
                        display: 'sample',
                        unit: 's',
                        min: 10,
                        max: 20,
                    },
                ],
                getMarketBySymbol: jest.fn(),
                getSubmarketBySymbol: jest.fn(),
                getTradeTypeCategoryByTradeType: jest.fn(),
            },
        },
    },
}));

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

describe('<DurationUnit />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();
        const initial_value = {
            durationtype: 's',
            symbol: 'R_100',
            tradetype: 'callput',
            duration: 15,
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <Formik
                        initialValues={initial_value}
                        validationSchema={Yup.object().shape({
                            duration_value: Yup.number().min(1, 'Minimum value should be more than 0'),
                        })}
                        onSubmit={mock_onSubmit}
                    >
                        {children}
                    </Formik>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render DurationUnit', async () => {
        const { container } = render(<DurationUnit />, {
            wrapper,
        });
        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });

    it('should select item from list', async () => {
        render(<DurationUnit />, {
            wrapper,
        });
        const autocomplete_element = screen.getByTestId('dt_qs_durationtype');
        userEvent.click(autocomplete_element);
        await waitFor(() => {
            const option_element = screen.getByText('sample');
            userEvent.click(option_element);
        });
        expect(autocomplete_element).toHaveDisplayValue('sample');
    });

    it('should be empty list if value not found', async () => {
        mock_store.ui.is_desktop = true;
        const mockAPI = ApiHelpers.instance as unknown as {
            contracts_for: {
                getDurations: jest.Mock<string, string[]>;
            };
        };
        mockAPI.contracts_for.getDurations = jest.fn().mockReturnValue([]);

        render(<DurationUnit />, {
            wrapper,
        });
        const autocomplete_element = screen.getByTestId('dt_qs_durationtype');
        userEvent.click(autocomplete_element);
        await waitFor(() => {
            const option_element = screen.getByText('No results found');
            userEvent.click(option_element);
        });

        expect(autocomplete_element).toHaveDisplayValue('');
    });
});
