import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import AddBot from '../add-bot';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: ({ children, is_open }: { children: JSX.Element; is_open: boolean }) => is_open && <div>{children}</div>,
}));

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

jest.mock('../../../../xml/martingale.xml', () => '');

window.Blockly = {
    Xml: {
        textToDom: jest.fn(),
        domToText: jest.fn(),
    },
    utils: {
        xml: { textToDom: jest.fn() },
    },
};

jest.mock('../config', () => ({
    ...jest.requireActual('../config'),
    STRATEGIES: {
        MARTINGALE: {
            name: 'martingale',
            label: 'martingale',
            description: 'martingale',
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
                        type: 'number',
                        name: 'duration',
                        validation: ['required', 'number', 'floor', 'min', 'max'],
                    },
                    {
                        type: 'duration',
                        name: 'duration',
                        validation: ['required', 'number', 'floor', 'min', 'max'],
                    },
                    {
                        type: 'number',
                        name: 'size',
                        validation: ['required'],
                    },
                    {
                        type: 'number',
                        name: 'profit',
                        validation: ['number', 'ceil'],
                    },
                    {
                        type: 'number',
                        name: 'loss',
                        validation: [
                            'number',
                            {
                                type: 'max',
                                value: 10,
                                getMessage: () => 'some message',
                            },
                        ],
                    },
                    {
                        type: 'label',
                        label: 'Duration',
                        description: 'The trade length of your purchased contract.',
                        hide: ['desktop'],
                    },
                    {
                        type: 'number',
                        name: 'last_digit_prediction',
                        validation: ['number', 'integer'],
                        should_have: [{ key: 'symbol', value: 'WLDAUD' }],
                        hide_without_should_have: true,
                    },
                    {
                        type: 'number',
                        name: 'max_stake',
                        validation: ['number', 'integer'],
                        should_have: [{ key: 'symbol', value: '', multiple: ['WLDAUD'] }],
                        hide_without_should_have: true,
                    },
                ],
                [],
            ],
        },
    },
}));

describe('<QuickStrategy />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    let mock_store = mockStore({
        ui: {
            is_mobile: true,
        },
    });
    const mock_dbot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_dbot_store?.server_bot?.setValue('durationtype', 't');
        mock_dbot_store?.server_bot?.setSelectedStrategy('MARTINGALE');

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_dbot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render QuickStrategy', async () => {
        const mock_setVisibility = jest.fn();
        const is_open = false;
        const { container } = render(<AddBot setFormVisibility={mock_setVisibility} is_open={is_open} />, {
            wrapper,
        });

        await waitFor(() => {
            expect(container).toBeInTheDocument();
        });
    });

    it('It should render desktop', () => {
        mock_store = mockStore({
            ui: {
                is_mobile: false,
            },
        });
        const mock_setVisibility = jest.fn();
        const is_open = false;
        render(<AddBot setFormVisibility={mock_setVisibility} is_open={is_open} />, {
            wrapper,
        });
    });
});
