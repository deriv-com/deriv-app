import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen, waitFor } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Chart from '../chart';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('../toolbar-widgets', () => jest.fn(() => <div>Mocked ToolbarWidgets</div>));

jest.mock('../v1', () => ({
    ...jest.requireActual('../v1'),
    __esModule: true,
    SmartChart: jest.fn(({ children, chartStatusListener, topWidgets, toolbarWidget }) => (
        <div>
            {children}
            {chartStatusListener()}
            {topWidgets()}
            {toolbarWidget()}
        </div>
    )),
    ChartTitle: jest.fn(() => <div>Mocked ChartTitle</div>),
}));

describe('Chart', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    <React.Suspense fallback={<div />}>{children}</React.Suspense>
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('renders Chart component with SmartChart component', async () => {
        const { container } = render(<Chart show_digits_stats={false} />, {
            wrapper,
        });
        await waitFor(() => {
            expect(container).toBeInTheDocument();
            expect(screen.getByText('Mocked ChartTitle')).toBeInTheDocument();
        });
    });
});
