import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Cards from '../cards';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('Cards', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Cards', () => {
        const { container } = render(<Cards has_dashboard_strategies={false} is_mobile={false} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the Cards', () => {
        const { container } = render(<Cards has_dashboard_strategies={true} is_mobile={true} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render the Bot builder tab on bot builder shortcut icon click', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={false} />, {
            wrapper,
        });
        const bot_builder = screen.getByTestId('dt_bot-builder');
        userEvent.click(bot_builder);
        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
    });

    it('should render the Quick strategy form in bot builder tab on quick strategy shortcut icon click', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={false} />, {
            wrapper,
        });

        const quick_strategy = screen.getByTestId('dt_quick-strategy');
        userEvent.click(quick_strategy);

        expect(mock_DBot_store?.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER));
        expect(mock_DBot_store?.quick_strategy.is_open).toBeTruthy();
    });

    it('should render the Google Drive upload modal on google drive shortcut icon click', () => {
        render(<Cards has_dashboard_strategies={false} is_mobile={true} />, {
            wrapper,
        });

        const google_drive = screen.getByTestId('dt_google-drive');
        userEvent.click(google_drive);

        expect(mock_DBot_store?.dashboard.is_dialog_open).toBeTruthy();
    });
});
