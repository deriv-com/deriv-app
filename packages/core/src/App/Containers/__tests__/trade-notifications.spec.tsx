import React from 'react';
import { render, screen } from '@testing-library/react';
import { SwipeableNotification } from '@deriv/components';
import { StoreProvider, mockStore, useStore } from '@deriv/stores';
import { getCardLabels } from '@deriv/shared';
import TradeNotifications from '../trade-notifications';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileWrapper: jest.fn(({ children }) => children),
    SwipeableNotification: ({
        children,
        onUnmount,
    }: React.ComponentProps<typeof SwipeableNotification> & { onUnmount?: () => void }) => {
        if (onUnmount) onUnmount();
        return <div>{children}</div>;
    },
}));

describe('TradeNotifications', () => {
    const STATUS = {
        OPEN: 'open',
        COMPLETED: 'completed',
    };
    const getTradeNotification = (status: string) => ({ id: `${Math.random()}_${status}`, status });
    const opened_trade_title = 'Trade opened:';

    const renderTradeNotifications = (
        mock_props: React.ComponentProps<typeof TradeNotifications> = {},
        mock_store: ReturnType<typeof useStore> = mockStore({})
    ) =>
        render(
            <StoreProvider store={mock_store}>
                <TradeNotifications {...mock_props} />
            </StoreProvider>
        );

    it('should not render notifications if show_trade_notifications is not passed', () => {
        renderTradeNotifications();
        expect(screen.queryByText(getCardLabels().TOTAL_PROFIT_LOSS)).not.toBeInTheDocument();
        expect(screen.queryByText(getCardLabels().STAKE)).not.toBeInTheDocument();
    });
    it('should not render notifications if show_trade_notifications is not passed and has no notifications', () => {
        renderTradeNotifications({ show_trade_notifications: true });
        expect(screen.queryByText(getCardLabels().TOTAL_PROFIT_LOSS)).not.toBeInTheDocument();
        expect(screen.queryByText(getCardLabels().STAKE)).not.toBeInTheDocument();
    });
    it('should render notifications if show_trade_notifications is passed and has "Trade opened" notification', () => {
        const mock_store = mockStore({
            notifications: {
                trade_notifications: [getTradeNotification(STATUS.OPEN)],
            },
        });
        renderTradeNotifications({ show_trade_notifications: true }, mock_store);
        expect(screen.getByText(opened_trade_title)).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().STAKE)).toBeInTheDocument();
    });
    it('should render notifications if show_trade_notifications is passed and has "Trade closed" notification', () => {
        const mock_store = mockStore({
            notifications: {
                trade_notifications: [getTradeNotification(STATUS.COMPLETED)],
            },
        });
        renderTradeNotifications({ show_trade_notifications: true }, mock_store);
        expect(screen.getByText('Trade closed:')).toBeInTheDocument();
        expect(screen.getByText(getCardLabels().TOTAL_PROFIT_LOSS)).toBeInTheDocument();
    });
    it('should display no more than 3 notifications', () => {
        const mock_store = mockStore({
            notifications: {
                trade_notifications: [
                    getTradeNotification(STATUS.OPEN),
                    getTradeNotification(STATUS.OPEN),
                    getTradeNotification(STATUS.OPEN),
                    getTradeNotification(STATUS.OPEN),
                ],
            },
        });
        renderTradeNotifications({ show_trade_notifications: true }, mock_store);
        expect(screen.getAllByText(opened_trade_title)).toHaveLength(3);
    });
});
