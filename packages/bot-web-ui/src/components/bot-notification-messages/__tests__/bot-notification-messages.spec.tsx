import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotNotificationMessages from '../bot-notification-messages';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/bot-skeleton', () => ({
    ...jest.requireActual('@deriv/bot-skeleton'),
    blocksCoordinate: jest.fn(),
}));

describe('BotNotificationMessages', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    beforeAll(() => {
        const mock_store = mockStore({
            ui: {
                notification_messages_ui: jest
                    .fn()
                    .mockReturnValue(<p>Mocked Notification Message</p>) as React.ElementType,
            },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render BotNotificationMessages', () => {
        const { container } = render(<BotNotificationMessages />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByTestId('dt_notifications_container')).toHaveClass('notifications-container');
    });

    it('should apply notifications-container__dashboard class when active tab is 0 and is_info_panel_visible is true', () => {
        mock_DBot_store!.dashboard.setInfoPanelVisibility(true);

        render(<BotNotificationMessages />, {
            wrapper,
        });

        expect(screen.getByTestId('dt_notifications_container')).toHaveClass(
            'notifications-container notifications-container__dashboard'
        );
    });

    it('should apply notifications-container--panel-open class when is_drawer_open is true and active tab has a value of 1 or 2', () => {
        mock_DBot_store!.dashboard.setActiveTab(1);
        mock_DBot_store!.run_panel.toggleDrawer(true);

        render(<BotNotificationMessages />, {
            wrapper,
        });

        expect(screen.getByTestId('dt_notifications_container')).toHaveClass(
            'notifications-container notifications-container--panel-open'
        );
    });
});
