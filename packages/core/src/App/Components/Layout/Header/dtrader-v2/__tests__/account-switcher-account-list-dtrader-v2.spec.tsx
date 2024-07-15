import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountListDTraderV2 from '../account-switcher-account-list-dtrader-v2';

const reset_balance_btn = 'Reset balance';
const account_title = 'Demo';
const mock_props = {
    balance: 1000,
    currency: 'USD',
    has_balance: true,
    has_reset_balance: true,
    is_disabled: false,
    is_virtual: true,
    loginid: 'VRTC124356',
    onClickResetVirtualBalance: jest.fn(),
    redirectAccount: jest.fn(),
    selected_loginid: 'VRTC224356',
};

describe('AccountListDTraderV2', () => {
    it('should render component with default passed props', () => {
        render(<AccountListDTraderV2 {...mock_props} />);

        expect(screen.getByText(account_title)).toBeInTheDocument();
        expect(screen.getByText('VRTC124356')).toBeInTheDocument();
        expect(screen.getByText(reset_balance_btn)).toBeInTheDocument();
    });

    it('should call onClickResetVirtualBalance is user clicks on "Reset balance" btn', () => {
        render(<AccountListDTraderV2 {...mock_props} />);

        expect(mock_props.onClickResetVirtualBalance).not.toBeCalled();
        userEvent.click(screen.getByText(reset_balance_btn));
        expect(mock_props.onClickResetVirtualBalance).toBeCalled();
    });

    it('should render balance if has_reset_balance === false, has_balance and currency are true', () => {
        render(<AccountListDTraderV2 {...mock_props} has_reset_balance={false} />);

        expect(screen.getByText(/1,000.00/)).toBeInTheDocument();
    });

    it('should not call redirectAccount if is_disabled === true', () => {
        render(<AccountListDTraderV2 {...mock_props} is_disabled />);

        expect(mock_props.redirectAccount).not.toBeCalled();
        userEvent.click(screen.getByText(account_title));
        expect(mock_props.redirectAccount).not.toBeCalled();
    });

    it('should call redirectAccount if is_disabled === false', () => {
        render(<AccountListDTraderV2 {...mock_props} />);

        expect(mock_props.redirectAccount).not.toBeCalled();
        userEvent.click(screen.getByText(account_title));
        expect(mock_props.redirectAccount).toBeCalled();
    });
});
