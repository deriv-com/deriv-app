import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DBOT_TABS } from 'Constants/bot-contents';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotBuilderTourMobile from '../bot-builder-tour-mobile';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('BotBuilder Tour Mobile', () => {
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
    it('should render BotBuilderTourMobile component', () => {
        mock_DBot_store.dashboard.setTourDialogVisibility(true);
        mock_DBot_store.dashboard.setActiveTab(DBOT_TABS.BOT_BUILDER);

        render(<BotBuilderTourMobile />, {
            wrapper,
        });
        expect(screen.getByText('Bot Builder guide')).toBeInTheDocument();
    });

    it('should render BotBuilderTourMobile when active tour is set to bot builder and tour dialog is false', () => {
        mock_DBot_store.dashboard.active_tour = 'bot_builder';
        mock_DBot_store.dashboard.setShowMobileTourDialog(false);

        render(<BotBuilderTourMobile />, {
            wrapper,
        });

        const start_button = screen.getByRole('button', { name: 'Start' });
        userEvent.click(start_button);

        expect(screen.getByTestId('botbuilder-tour-mobile')).toBeInTheDocument();
    });
});
