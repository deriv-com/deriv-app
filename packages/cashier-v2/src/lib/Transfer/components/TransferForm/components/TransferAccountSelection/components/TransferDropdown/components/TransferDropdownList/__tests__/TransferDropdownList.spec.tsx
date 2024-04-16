import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransferDropdownList from '../TransferDropdownList';

jest.mock('../../TransferAccountTile', () => ({
    ...jest.requireActual('../../TransferAccountTile'),
    TransferAccountTile: jest.fn(({ account, isActive }) => (
        <span>{`TransferAccountTile-${account.loginid}-${String(isActive)}`}</span>
    )),
}));

const mockAccounts = {
    'Deriv MT5 accounts': [{ account_type: 'mt5', loginid: 'CR1' }],
    'Deriv cTrader accounts': [{ account_type: 'ctrader', loginid: 'CR2' }],
    'Deriv X accounts': [],
};

const mockSelectedAccount = mockAccounts['Deriv cTrader accounts'][0];

const mockOnSelect = jest.fn(account => {});

describe('<TransferDropdownList />', () => {
    it('should test if accounts are rendered properly under the correct header', () => {
        render(
            <TransferDropdownList
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                accounts={mockAccounts}
                onSelect={mockOnSelect}
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                value={mockAccounts['Deriv cTrader accounts']}
            />
        );

        expect(screen.getByText('Deriv MT5 accounts')).toBeInTheDocument();
        expect(screen.getByText('TransferAccountTile-CR1-false')).toBeInTheDocument();
    });

    it('should test if there are no accounts for a particular account_type then the header is also not present for that type', () => {
        render(
            <TransferDropdownList
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                accounts={mockAccounts}
                onSelect={mockOnSelect}
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                value={mockAccounts['Deriv cTrader accounts']}
            />
        );

        expect(screen.queryByText('Deriv X accounts')).not.toBeInTheDocument();
    });

    it('should test if onSelect is triggered upon clicking the account', async () => {
        render(
            <TransferDropdownList
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                accounts={mockAccounts}
                onSelect={mockOnSelect}
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                value={mockAccounts['Deriv cTrader accounts']}
            />
        );
        const firstAccount = screen.getByText('TransferAccountTile-CR1-false');

        await userEvent.click(firstAccount);

        expect(mockOnSelect).toBeCalledWith(mockAccounts['Deriv MT5 accounts'][0]);
    });

    it('should test if selected account is passed with isActive prop as true', () => {
        render(
            <TransferDropdownList
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                accounts={mockAccounts}
                onSelect={mockOnSelect}
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                value={mockSelectedAccount}
            />
        );
        expect(screen.getByText('TransferAccountTile-CR2-true')).toBeInTheDocument();
    });
});
