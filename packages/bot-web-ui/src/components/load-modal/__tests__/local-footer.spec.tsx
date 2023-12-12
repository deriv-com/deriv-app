import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import LocalFooter from '../local-footer';
import { isMobile } from '@deriv/shared';
import DashboardStore from 'Stores/dashboard-store';
import LoadModalStore from 'Stores/load-modal-store';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

describe('LocalFooter', () => {
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
            } as LoadModalStore,
        };

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render LocalFooter', () => {
        const { container } = render(<LocalFooter />, { wrapper });
        expect(container).toBeInTheDocument();
    });

    it('should display Cancel button when isMobile is true', async () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        render(<LocalFooter />, { wrapper });
        const cancel_button = screen.getByRole('button', { name: /cancel/i });
        expect(cancel_button).toBeInTheDocument();

        userEvent.click(cancel_button);

        expect(mock_DBot_store?.load_modal.setLoadedLocalFile).toHaveBeenCalledWith(null);
    });

    it('should display Open button when isMobile is false', async () => {
        (isMobile as jest.Mock).mockReturnValue(false);
        render(<LocalFooter />, { wrapper });
        const open_button = screen.getByRole('button', { name: /open/i });
        expect(open_button).toBeInTheDocument();

        userEvent.click(open_button);

        expect(mock_DBot_store?.load_modal.loadFileFromLocal).toHaveBeenCalled();
        expect(mock_DBot_store?.load_modal.toggleLoadModal).toHaveBeenCalled();
        expect(mock_DBot_store?.dashboard.setPreviewOnPopup).toHaveBeenCalledWith(false);
        expect(mock_DBot_store?.dashboard.setOpenSettings).toHaveBeenCalledWith('import');
    });
});
