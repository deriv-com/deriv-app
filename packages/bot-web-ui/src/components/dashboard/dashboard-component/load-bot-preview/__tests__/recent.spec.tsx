import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore, useDBotStore } from 'Stores/useDBotStore';
import RecentComponent from '../recent';
import DashboardStore from 'Stores/dashboard-store';
import LoadModalStore from 'Stores/load-modal-store';
import SaveModalStore from 'Stores/save-modal-store';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const dashboard_strategy = {
    name: '',
    xml: '',
    save_type: '',
    timestamp: 1,
};

const dashboard_strategies = [
    { ...dashboard_strategy, name: 'Strategy1', id: '1' },
    { ...dashboard_strategy, name: 'Strategy2', id: '2' },
];

describe('RecentComponent', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeAll(() => {
        const mock_store = mockStore({});
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        mock_DBot_store = {
            ...mock_DBot_store,
            dashboard: {
                ...mock_DBot_store.dashboard,
                setPreviewOnPopup: jest.fn(),
                setOpenSettings: jest.fn(),
                setStrategySaveType: jest.fn(),
                is_dark_mode: false,
                initInfoPanel: jest.fn(),
            } as DashboardStore,
            load_modal: {
                ...mock_DBot_store.load_modal,
                loadFileFromLocal: jest.fn(),
                toggleLoadModal: jest.fn(),
                setLoadedLocalFile: jest.fn(),
                preview_workspace: jest.fn() as unknown,
                selected_strategy: jest.fn() as unknown,
                tab_name: 'google_tab',
                setDashboardStrategies: jest.fn(),
                getDashboardStrategies: jest.fn(),
                onDriveOpen: jest.fn(),
                dashboard_strategies,
                getRecentFileIcon: jest.fn(),
                getSaveType: jest.fn(),
            } as LoadModalStore,
            save_modal: {
                ...mock_DBot_store.save_modal,
                toggleSaveModal: jest.fn(),
                updateBotName: jest.fn(),
                onConfirmSave: jest.fn(),
                onDriveConnect: jest.fn(),
            } as SaveModalStore,
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('Should display the list of strategies', () => {
        render(<RecentComponent />, { wrapper });
        const recent_сomponent = screen.getByText('Your bots:');

        const strategy_one = screen.getByText('Strategy1');
        const strategy_two = screen.getByText('Strategy2');

        expect(recent_сomponent).toBeInTheDocument();
        expect(strategy_one).toBeInTheDocument();
        expect(strategy_two).toBeInTheDocument();
    });

    it('Should display text size equal to "xs" when using the mobile version', () => {
        (isMobile as jest.Mock).mockReturnValueOnce(true);
        render(<RecentComponent />, { wrapper });

        const load_strategy_label = screen.getByText('Your bots:');

        expect(load_strategy_label).toBeInTheDocument();
        expect(load_strategy_label).toHaveStyle('--text-size: var(--text-size-xs)');
    });

    it('Should not display anything if the list of strategies is empty', () => {
        if (mock_DBot_store) {
            mock_DBot_store = {
                ...mock_DBot_store,
                load_modal: { ...mock_DBot_store.load_modal, dashboard_strategies: [] } as LoadModalStore,
            };
        }
        render(<RecentComponent />, { wrapper });

        const recent_component = screen.queryByText('Your bots:');

        expect(recent_component).not.toBeInTheDocument();
    });
});
