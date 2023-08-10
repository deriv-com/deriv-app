import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import BotStopNotification from './bot-stop-notification';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
};
describe('BotStopNotification', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;

    beforeEach(() => {
        jest.resetModules();
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

    it('should clear the notification timer and hide message after timer expires', () => {
        act(() => {
            mock_DBot_store?.run_panel.setShowBotStopMessage(false);
        });
        jest.useFakeTimers();

        render(<BotStopNotification />, {
            wrapper,
        });

        // Advance timers to trigger notificationTimer
        jest.advanceTimersByTime(6000);

        // Expect that setShowBotStopMessage(false) was called
        expect(screen.queryByText('You’ve just stopped the bot.')).not.toBeInTheDocument();
    });

    it('should render the toast component', () => {
        const { container } = render(<BotStopNotification />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should render to remove the toast component when clicking on close icon', () => {
        act(() => {
            mock_DBot_store?.run_panel.setShowBotStopMessage(false);
        });

        render(<BotStopNotification />, {
            wrapper,
        });
        userEvent.click(screen.getByTestId('notification-close'));
        expect(screen.queryByText('You’ve just stopped the bot.')).not.toBeInTheDocument();
    });

    it('should render toast', () => {
        act(() => {
            mock_DBot_store?.run_panel.setShowBotStopMessage(true);
        });

        render(<BotStopNotification />, {
            wrapper,
        });
        fireEvent.mouseOver(screen.getByTestId('bot-stop-notification'));
        jest.advanceTimersByTime(6000);
        expect(screen.queryByText('You’ve just stopped the bot.')).not.toBeInTheDocument();

        fireEvent.mouseLeave(screen.getByTestId('bot-stop-notification'));
        jest.advanceTimersByTime(4000);
        expect(screen.queryByText('You’ve just stopped the bot.')).not.toBeInTheDocument();
    });
});
