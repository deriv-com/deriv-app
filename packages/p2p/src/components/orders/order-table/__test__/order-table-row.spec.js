import React from 'react';
import { useStores } from 'Stores';
import { secondsToTimer } from 'Utils/date-time';
import { createExtendedOrderDetails } from 'Utils/orders';
import ServerTime from 'Utils/server-time';
import { Table } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderRow from '../order-table-row.jsx';

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({
        general_store: {
            is_active_tab: false,
            client: '',
            props: {},
            getLocalStorageSettingsForLoginId: jest.fn().mockReturnValue({
                notifications: {
                    some: jest.fn(),
                },
            }),
        },
        order_store: {
            setQueryDetails: jest.fn(),
        },
        sendbird_store: {
            setShouldShowChatModal: jest.fn(),
            setShouldShowChatOnOrders: jest.fn(),
        },
    }),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    formatMoney: jest.fn(),
    isMobile: jest.fn().mockReturnValue(false),
}));

jest.mock('Utils/date-time', () => ({
    secondsToTimer: jest.fn().mockReturnValue({}),
}));

jest.mock('Utils/orders', () => ({
    createExtendedOrderDetails: jest.fn().mockReturnValue({ other_user_details: {} }),
}));

jest.mock('Utils/server-time', () => ({
    __esModule: true,
    default: {
        getDistanceToServerTime: jest.fn(),
    },
}));

describe('<OrderRow/>', () => {
    const props = {
        style: '',
        row: {
            amount: 0,
            account_currency: 'USD',
            amount_display: 'USD',
            id: 0,
            is_buy_order: false,
            is_my_ad: false,
            is_sell_order: false,
            local_currency: 'INR',
            order_expiry_milliseconds: 17,
            order_purchase_datetime: 0,
            other_user_details: {},
            rate: 0,
            should_highlight_alert: '',
            should_highlight_danger: '',
            should_highlight_disabled: '',
            should_highlight_success: '',
            status_string: '',
        },
    };
    beforeAll(() => {
        Table.Body = jest.fn(() => <div>Table body</div>);
        Table.Head = jest.fn(() => <div>Table head</div>);
        Table.Header = jest.fn(({ children }) => (
            <div>
                Table header<div>{children}</div>
            </div>
        ));
        Table.Row = jest.fn(({ children }) => (
            <div>
                Table row<div>{children}</div>
            </div>
        ));
        Table.Cell = jest.fn(({ children }) => (
            <div>
                Table cell<div>{children}</div>
            </div>
        ));
    });

    it('should invoke setup functions to configure component', () => {
        ServerTime.getDistanceToServerTime.mockReturnValue(8);
        render(<OrderRow {...props} />);

        expect(ServerTime.getDistanceToServerTime).toHaveBeenCalledWith(17);
        expect(secondsToTimer).toHaveBeenCalledWith(8);
    });

    it('should contain 7 columns in desktop', () => {
        render(<OrderRow {...props} />);

        expect(screen.getAllByText('Table cell').length).toBe(7);
    });

    it('should contain 3 columns in mobile', () => {
        isMobile.mockReturnValue(true);
        const { general_store } = useStores();
        render(<OrderRow {...props} />);

        expect(screen.getAllByText('Table cell').length).toBe(3);
        expect(general_store.getLocalStorageSettingsForLoginId).toHaveBeenCalled();
    });

    it('should invoke query details when table row is clicked', () => {
        const { order_store } = useStores();
        isMobile.mockReturnValue(false);
        render(<OrderRow {...props} />);
        fireEvent.click(screen.getByTestId('table-row-desktop'));

        expect(order_store.setQueryDetails).toHaveBeenCalled();
    });

    it('should setup timer and order state on initial load', async () => {
        jest.useFakeTimers();
        ServerTime.getDistanceToServerTime.mockReturnValue(-1);
        render(<OrderRow {...props} />);
        act(() => {
            jest.runAllTimers();
        });
        await waitFor(() => {
            expect(createExtendedOrderDetails).toHaveBeenCalled();
            jest.useRealTimers();
        });
    });
});
