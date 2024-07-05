import React from 'react';
import { render, screen } from '@testing-library/react';
import Loadable from 'react-loadable';
import AccountActionsDTraderV2 from '../account-actions-dtrader-v2';

const mock_props = {
    acc_switcher_disabled_message: 'acc_switcher_disabled_message',
    account_switcher_title: 'account_switcher_title',
    account_type: 'account_type',
    balance: 1000,
    currency: 'USD',
    is_acc_switcher_on: true,
    is_acc_switcher_disabled: false,
    is_eu: true,
    is_virtual: true,
    notifications_count: 0,
    toggleAccountsDialog: jest.fn(),
};
const media_query_list = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

jest.mock('../notifications-icon-dtrader-v2', () => jest.fn(() => 'NotificationsIconDTraderV2'));
jest.mock('../account-info-dtrader-v2', () => jest.fn(() => 'AccountInfoDTraderV2'));

window.matchMedia = jest.fn().mockImplementation(() => media_query_list);
Loadable.preloadAll();

describe('AccountActionsDTraderV2', () => {
    it('should render icon component without Badge count if notifications_count is falsy', () => {
        render(<AccountActionsDTraderV2 {...mock_props} />);

        expect(screen.getByText('NotificationsIconDTraderV2')).toBeInTheDocument();
    });

    it('should render icon component with Badge count if notifications_count was passed', () => {
        render(<AccountActionsDTraderV2 {...mock_props} notifications_count={2} balance={undefined} />);

        expect(screen.getByText('AccountInfoDTraderV2')).toBeInTheDocument();
        expect(screen.getByText('NotificationsIconDTraderV2')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render component even if balance is undefined', () => {
        render(<AccountActionsDTraderV2 {...mock_props} balance={undefined} />);

        expect(screen.getByText('AccountInfoDTraderV2')).toBeInTheDocument();
        expect(screen.getByText('NotificationsIconDTraderV2')).toBeInTheDocument();
    });

    it('should not render notifications icon if has_notifications_icon is false', () => {
        render(<AccountActionsDTraderV2 {...mock_props} has_notifications_icon={false} />);

        expect(screen.queryByText('NotificationsIconDTraderV2')).not.toBeInTheDocument();
    });
});
