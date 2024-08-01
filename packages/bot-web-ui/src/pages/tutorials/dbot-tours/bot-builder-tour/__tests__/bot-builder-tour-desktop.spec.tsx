import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTourDesktop from '../bot-builder-tour-desktop';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

describe('Bot Builder Tour Desktop', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({});
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeAll(() => {
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render BotBuilderTourDesktop component with tour start dialog', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<BotBuilderTourDesktop />, {
            wrapper,
        });

        expect(screen.getByText("Let's build a Bot!")).toBeInTheDocument();
    });

    it('should render BotBuilderTourDesktop component with tour end dialog', () => {
        mock_store.ui.is_desktop = true;
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);
        mock_DBot_store.dashboard.setActiveTour('bot_builder');

        render(<BotBuilderTourDesktop />, {
            wrapper,
        });

        expect(screen.getByText('Congratulations')).toBeInTheDocument();
    });
});
