import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import { TWebSocket } from 'Types';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import ChartModalDesktop from '../chart-modal-desktop';

let mockFunction: boolean | jest.Mock;

jest.mock('lodash.debounce', () => (fn: jest.Mock) => {
    if (!mockFunction) mockFunction = fn;
    return mockFunction;
});

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@jimdanielswasswa/test-chart', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

jest.mock('../../../chart', () => ({
    __esModule: true,
    default: () => <div>Mocked Chart component</div>,
}));

jest.useFakeTimers();

describe('ChartModalDesktop', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_websocket = mock_ws as unknown as TWebSocket;
    beforeEach(() => {
        mockFunction = false;
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_websocket);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_websocket} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render ChartModalDesktop', () => {
        mock_DBot_store?.dashboard?.setChartModalVisibility();
        render(<ChartModalDesktop />, {
            wrapper,
        });
        jest.advanceTimersByTime(400);
        const chart_modal_dialog = screen.queryByText('Mocked Chart component');
        expect(chart_modal_dialog).toBeInTheDocument();
    });
});
