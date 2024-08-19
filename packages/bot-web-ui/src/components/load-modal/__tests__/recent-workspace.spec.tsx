import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import RecentWorkspace from '../recent-workspace';
import { TStrategy } from 'Types';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_workspace = {
    id: 'test-id-1',
    name: 'sample',
    save_type: 'local',
    timestamp: 1697621094136,
    xml: '<xml>Sample</xml>',
};

type TMockStrategy = Array<TStrategy>;

const strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const mock_strategy: TMockStrategy = [
    { ...strategy, name: 'martingale', id: 'test-id-1' },
    { ...strategy, name: 'd_alembert', id: 'test-id-1' },
    { ...strategy, name: 'oscar_grind', id: 'test-id-1' },
];

describe('RecentWorkspace', () => {
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

    it('should render RecentWorkspace', () => {
        const { container } = render(<RecentWorkspace workspace={mock_workspace} />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should show strategy saved time in proper format', () => {
        render(<RecentWorkspace workspace={mock_workspace} />, { wrapper });
        expect(screen.getByText('18 Oct 2023')).toBeInTheDocument();
    });

    it('should update selected strategy ID on clicking the strategy', () => {
        mock_DBot_store?.load_modal?.setRecentStrategies(mock_strategy);
        render(<RecentWorkspace workspace={mock_workspace} />, { wrapper });
        const recent_workspace_item = screen.getByTestId('dt_recent_workspace_item');
        userEvent.click(recent_workspace_item);
        expect(mock_DBot_store?.load_modal?.selected_strategy_id).toBe(mock_strategy[0].id);
    });
});
