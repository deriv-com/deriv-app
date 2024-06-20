import React from 'react';
import { render, screen } from '@testing-library/react';
import Loadable from 'react-loadable';
import AccountActionsDTraderV2 from '../account-actions-dtrader-v2';

const mockProps = {
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
const mediaQueryList = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    LabelPairedBellLgRegularIcon: jest.fn(() => 'LabelPairedBellLgRegularIcon'),
}));
jest.mock('../account-info-dtrader-v2', () => jest.fn(() => 'AccountInfoDTraderV2'));

window.matchMedia = jest.fn().mockImplementation(() => mediaQueryList);
Loadable.preloadAll();

describe('AccountActionsDTraderV2', () => {
    it('should render icon component without Badge count if notifications_count is falsy', () => {
        render(<AccountActionsDTraderV2 {...mockProps} />);

        expect(screen.getByText('LabelPairedBellLgRegularIcon')).toBeInTheDocument();
    });

    it('should render icon component with Badge count if notifications_count was passed', () => {
        render(<AccountActionsDTraderV2 {...mockProps} notifications_count={2} balance={undefined} />);

        expect(screen.getByText('AccountInfoDTraderV2')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedBellLgRegularIcon')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render component even if balance is undefined', () => {
        render(<AccountActionsDTraderV2 {...mockProps} balance={undefined} />);

        expect(screen.getByText('AccountInfoDTraderV2')).toBeInTheDocument();
        expect(screen.getByText('LabelPairedBellLgRegularIcon')).toBeInTheDocument();
    });
});
