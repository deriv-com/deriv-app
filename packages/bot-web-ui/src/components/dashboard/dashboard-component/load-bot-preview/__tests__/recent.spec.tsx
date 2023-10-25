import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import RecentComponent from '../recent';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('Stores/useDBotStore');

type TDBotStore = ReturnType<typeof useDBotStore>;

const mockedProps = useDBotStore as jest.MockedFunction<typeof useDBotStore>;

const dashboard_strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const mock_load_modal = {
    dashboard_strategies: [
        { ...dashboard_strategy, name: 'Strategy1', id: '1' },
        { ...dashboard_strategy, name: 'Strategy2', id: '2' },
    ],
    setDashboardStrategies: jest.fn(),
    getRecentFileIcon: jest.fn(),
    getSaveType: jest.fn(),
};

const default_mock_store: Partial<TDBotStore> = {
    load_modal: mock_load_modal as unknown as TDBotStore['load_modal'],
    dashboard: {
        setStrategySaveType: jest.fn(),
        strategy_save_type: '',
    } as unknown as TDBotStore['dashboard'],
    save_modal: {
        toggleSaveModal: jest.fn(),
        updateBotName: jest.fn(),
    } as unknown as TDBotStore['save_modal'],
};

describe('RecentComponent', () => {
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

    it('Should display the list of strategies', () => {
        mockedProps.mockReturnValue(default_mock_store as unknown as TDBotStore);
        render(<RecentComponent />);

        const strategy_one = screen.getByText('Strategy1');
        const strategy_two = screen.getByText('Strategy2');

        expect(strategy_one).toBeInTheDocument();
        expect(strategy_two).toBeInTheDocument();
    });

    it('Should not display anything if the list of strategies is empty', () => {
        mockedProps.mockReturnValue({
            ...default_mock_store,
            load_modal: { ...mock_load_modal, dashboard_strategies: [] },
        } as unknown as TDBotStore);
        render(<RecentComponent />);

        const recent_component = screen.queryByText('Your bots:');

        expect(recent_component).not.toBeInTheDocument();
    });

    it('Should display text size equal to "xs" when using the mobile version', () => {
        mockedProps.mockReturnValue(default_mock_store as unknown as TDBotStore);
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<RecentComponent />);

        const load_strategy_label = screen.getByText('Your bots:');

        expect(load_strategy_label).toBeInTheDocument();
        expect(load_strategy_label).toHaveStyle('--text-size: var(--text-size-xs)');
    });
});
