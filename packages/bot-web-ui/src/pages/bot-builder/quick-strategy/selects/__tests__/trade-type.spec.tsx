import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TradeType from '../trade-type';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    ApiHelpers: {
        instance: {
            contracts_for: {
                getDurations: jest.fn(),
                getMarketBySymbol: jest.fn(),
                getSubmarketBySymbol: jest.fn(),
                getTradeTypeCategoryByTradeType: jest.fn(),
                getTradeTypesForQuickStrategy: () => [
                    {
                        text: 'Rise/Fall',
                        value: 'callput',
                        group: 'Up/Down',
                        icon: ['CALL', 'PUT'],
                    },
                    {
                        text: 'Rise Equals/Fall Equals',
                        value: 'callputequal',
                        group: 'Up/Down',
                        icon: ['CALLE', 'PUTE'],
                    },
                ],
            },
            active_symbols: jest.fn(),
        },
    },
}));

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
};

let initial_value = {
    durationtype: 1,
    symbol: 'R_100',
    tradetype: 'callput',
};

describe('<TradeType />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        const mock_onSubmit = jest.fn();

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
    it('should render TradeType', () => {
        const { container } = render(<TradeType key={1} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should select the first item from list on the first time the browser is used', async () => {
        render(<TradeType key='callputequal' />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('dt_qs_tradetype');
        userEvent.click(autocomplete_element);
        await waitFor(() => {
            const option_element = screen.getByText(/Rise\/Fall/i);
            userEvent.click(option_element);
        });
        expect(autocomplete_element).toHaveDisplayValue([/Rise\/Fall/i]);
    });

    it('should be empty list if tradetype not found on the first time the browser is used', async () => {
        initial_value = {
            durationtype: 1,
            symbol: 'R_100',
            tradetype: '',
        };
        render(<TradeType />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('dt_qs_tradetype');
        userEvent.click(autocomplete_element);

        expect(autocomplete_element).toHaveDisplayValue('');
    });

    it('should be empty list if symbol not found on the first time the browser is used', async () => {
        initial_value = {
            durationtype: 1,
            symbol: '',
            tradetype: '',
        };
        render(<TradeType />, {
            wrapper,
        });

        const autocomplete_element = screen.getByTestId('dt_qs_tradetype');
        userEvent.click(autocomplete_element);
        await waitFor(() => {
            const option_element = screen.getByText('No results found');
            userEvent.click(option_element);
        });

        expect(autocomplete_element).toHaveDisplayValue('');
    });
});
