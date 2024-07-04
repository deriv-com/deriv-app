import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountInfoDTraderV2 from '../account-info-dtrader-v2';

const account_switcher_title = 'account_switcher_title';

jest.mock('../../account-info-wrapper', () => jest.fn(({ children }) => children));
jest.mock('../account-switcher-dtrader-v2', () => jest.fn(() => 'AccountSwitcherDTraderV2'));

const media_query_list = {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

window.matchMedia = jest.fn().mockImplementation(() => media_query_list);

describe('AccountInfoDTraderV2', () => {
    let mock_props: React.ComponentProps<typeof AccountInfoDTraderV2>;

    beforeEach(() => {
        mock_props = {
            acc_switcher_disabled_message: 'acc_switcher_disabled_message',
            account_switcher_title,
            balance: 100,
            currency: 'USD',
            is_dialog_on: true,
            is_virtual: true,
            is_disabled: false,
            toggleDialog: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    it('should render component with default passed props', () => {
        render(<AccountInfoDTraderV2 {...mock_props} />);

        expect(screen.getByText(account_switcher_title)).toBeInTheDocument();
        expect(screen.getByText('100 USD')).toBeInTheDocument();
        expect(screen.getByText('AccountSwitcherDTraderV2')).toBeInTheDocument();
    });

    it('should not call toggleDialog if user clicks on account switcher and is_disabled === true', () => {
        render(<AccountInfoDTraderV2 {...mock_props} is_disabled />);

        expect(mock_props.toggleDialog).not.toBeCalled();
        userEvent.click(screen.getByText(account_switcher_title));
        expect(mock_props.toggleDialog).not.toBeCalled();
    });

    it('should call toggleDialog if user clicks on account switcher and is_disabled === false', () => {
        render(<AccountInfoDTraderV2 {...mock_props} />);

        expect(mock_props.toggleDialog).not.toBeCalled();
        userEvent.click(screen.getByText(account_switcher_title));
        expect(mock_props.toggleDialog).toBeCalled();
    });

    it('should render "No currency assigned" if currency is falsy', () => {
        render(<AccountInfoDTraderV2 {...mock_props} currency='' />);

        expect(screen.getByText('No currency assigned')).toBeInTheDocument();
    });

    it('should render "No currency assigned" if currency is falsy and balance was not passed', () => {
        render(<AccountInfoDTraderV2 {...mock_props} currency='' balance={undefined} />);

        expect(screen.getByText('No currency assigned')).toBeInTheDocument();
    });

    it('should not render account_switcher_title if it was not passed', () => {
        render(<AccountInfoDTraderV2 {...mock_props} account_switcher_title={undefined} />);

        expect(screen.queryByText(account_switcher_title)).not.toBeInTheDocument();
    });

    it('should call toggleDialog with "false" if user clicks outside the modal when it was open', () => {
        render(<AccountInfoDTraderV2 {...mock_props} />);

        expect(mock_props.toggleDialog).not.toBeCalled();
        userEvent.click(screen.getByText(account_switcher_title));
        expect(mock_props.toggleDialog).toBeCalled();
        userEvent.click(screen.getByTestId('dt-actionsheet-overlay'));
        expect(mock_props.toggleDialog).toBeCalledWith(false);
    });
});
