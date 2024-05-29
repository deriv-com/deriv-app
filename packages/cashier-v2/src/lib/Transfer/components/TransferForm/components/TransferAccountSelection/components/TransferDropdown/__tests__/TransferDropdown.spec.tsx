import React from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransferDropdown from '../TransferDropdown';
import { TTransferableAccounts } from '../../../../../../../types';

const mockAccounts = [
    { account_type: 'mt5', loginid: 'CR1' },
    { account_type: 'ctrader', loginid: 'CR2' },
    { account_type: 'dxtrade', loginid: 'CR3' },
    { account_type: 'binary', loginid: 'CR4' },
    { account_type: 'binary', loginid: 'CR5' },
    { account_type: 'binary', loginid: 'CR6' },
] as TTransferableAccounts;

const mockOnSelect = jest.fn(account => {});

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    TransferAccountTile: jest.fn(({ account }) => (
        <span>
            {account.account_type}-{account.loginid}
        </span>
    )),
    TransferDropdownList: jest.fn(
        ({
            accounts,
            onSelectItem,
            value,
        }: {
            accounts: TTransferableAccounts;
            onSelectItem: typeof mockOnSelect;
            value: TTransferableAccounts[number];
        }) => {
            return (
                <span data-testid='dt_transfer_dropdown_items'>
                    {`accounts-${JSON.stringify(accounts)}_value-${JSON.stringify(value)}`}
                </span>
            );
        }
    ),
}));

describe('<TransferDropdown />', () => {
    afterEach(cleanup);

    it('should check if the correct details are displayed for the selected account', () => {
        render(
            <TransferDropdown accounts={mockAccounts} label='From' onSelect={mockOnSelect} value={mockAccounts[0]} />
        );

        expect(screen.getByText(`${mockAccounts[0].account_type}-${mockAccounts[0].loginid}`)).toBeInTheDocument();
    });

    it('should test the toggling of the options list of dropdown', async () => {
        render(
            <TransferDropdown accounts={mockAccounts} label='From' onSelect={mockOnSelect} value={mockAccounts[0]} />
        );
        const transferDropdownToggle = screen.getByTestId('dt_transfer_dropdown_selection_toggle');

        userEvent.click(transferDropdownToggle);

        expect(screen.getByTestId('dt_transfer_dropdown_items')).toBeInTheDocument();

        userEvent.click(transferDropdownToggle);

        expect(screen.queryByTestId('dt_transfer_dropdown_items')).not.toBeInTheDocument();
    });

    it('should check whether the list of accounts are correctly rendered when the dropdown is expanded', async () => {
        render(
            <TransferDropdown accounts={mockAccounts} label='From' onSelect={mockOnSelect} value={mockAccounts[0]} />
        );

        const transferDropdownToggle = screen.getByTestId('dt_transfer_dropdown_selection_toggle');

        userEvent.click(transferDropdownToggle);

        const transferDropdownItems = screen.getByTestId('dt_transfer_dropdown_items');

        expect(
            within(transferDropdownItems).getByText(
                `accounts-${JSON.stringify({
                    'Deriv MT5 accounts': [{ account_type: 'mt5', loginid: 'CR1' }],
                    'Deriv cTrader accounts': [{ account_type: 'ctrader', loginid: 'CR2' }],
                    'Deriv X accounts': [{ account_type: 'dxtrade', loginid: 'CR3' }],
                    'Deriv accounts': [
                        { account_type: 'binary', loginid: 'CR4' },
                        { account_type: 'binary', loginid: 'CR5' },
                        { account_type: 'binary', loginid: 'CR6' },
                    ],
                })}_value-${JSON.stringify({ account_type: 'mt5', loginid: 'CR1' })}`
            )
        ).toBeInTheDocument();
    });

    it('should check whether correct helper message is displayed under the dropdown', () => {
        render(
            <TransferDropdown
                accounts={mockAccounts}
                label='From'
                message='This is a test.'
                onSelect={mockOnSelect}
                value={mockAccounts[0]}
            />
        );

        expect(screen.getByText('This is a test.')).toBeInTheDocument();
    });

    it('should check whether correct label is displayed for the dropdown', () => {
        render(
            <TransferDropdown
                accounts={mockAccounts}
                label='This is the label.'
                onSelect={mockOnSelect}
                value={mockAccounts[0]}
            />
        );

        expect(screen.getByText('This is the label.')).toBeInTheDocument();
    });
});
