import React from 'react';
import { Formik } from 'formik';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import QuickStrategyForm from '../form';

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
            active_symbols: {
                getSymbolsForBot: () => [
                    {
                        text: 'AUD Basket',
                        value: 'WLDAUD',
                        group: 'Forex Basket',
                    },
                    {
                        text: 'Bear Market Index',
                        value: 'RDBULL',
                        group: 'Daily Reset Indices',
                    },
                ],
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

jest.mock('../config', () => ({
    STRATEGIES: {
        RSI: {
            name: 'RSI',
            label: 'RSI',
            description: 'test',
            fields: [
                [
                    {
                        type: 'symbol',
                        name: 'symbol',
                    },
                    {
                        type: 'tradetype',
                        name: 'tradetype',
                        dependencies: ['symbol'],
                    },
                    {
                        type: 'durationtype',
                        name: 'durationtype',
                        dependencies: ['symbol', 'tradetype'],
                        attached: true,
                    },
                    {
                        type: 'label',
                        label: 'Size',
                        description: null,
                    },
                    {
                        type: 'number',
                        name: 'size',
                        validation: ['number', 'floor', 'min'],
                    },
                    {
                        type: '',
                        name: 'size',
                        validation: ['number', 'floor', 'min'],
                    },
                    {
                        type: 'label',
                        label: null,
                        validation: ['number', 'floor', 'min'],
                    },
                    {
                        type: 'number',
                        name: null,
                        validation: ['number', 'floor', 'min'],
                    },
                    {
                        type: 'label',
                        label: 'Duration',
                        description: 'The trade length of your purchased contract.',
                        hide: ['desktop'],
                    },
                ],
                [],
            ],
        },
    },
}));

describe('<QuickStrategyForm />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('RSI');
        const mock_onSubmit = jest.fn();
        const initial_value = {
            tradetype: 'callput',
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

    it('should render TradeType', () => {
        const { container } = render(<QuickStrategyForm key={1} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('On press of enter handleEnter should run', async () => {
        const mockEventListener = jest.fn();
        document.addEventListener('keydown', mockEventListener);
        render(<QuickStrategyForm />, {
            wrapper,
        });
        const input = screen.getByTestId('qs_autocomplete_tradetype');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13 });
        fireEvent.keyDown(input, { keyCode: 13 });
        expect(mockEventListener).toHaveBeenCalledWith(
            expect.objectContaining({ key: 'Enter', code: 'Enter', keyCode: 13 })
        );
    });
});
