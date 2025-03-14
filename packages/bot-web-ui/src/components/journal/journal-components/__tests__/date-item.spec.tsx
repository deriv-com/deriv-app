import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DateItem from '../date-item';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@jimdanielswasswa/test-chart', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('Draggable', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    test('should renders DateItem', () => {
        const { container } = render(<DateItem date='2023-10-06' time='06:39:00 GMT' />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    test('should show date', () => {
        render(<DateItem date='2023-10-06' time='06:39:00 GMT' />, {
            wrapper,
        });
        const date_text = screen.getByText('2023-10-06');
        expect(date_text).toBeInTheDocument();
    });

    test('should show time', () => {
        render(<DateItem date='2023-10-06' time='06:39:00 GMT' />, {
            wrapper,
        });
        const time_text = screen.getByText('06:39:00 GMT');
        expect(time_text).toBeInTheDocument();
    });
});
