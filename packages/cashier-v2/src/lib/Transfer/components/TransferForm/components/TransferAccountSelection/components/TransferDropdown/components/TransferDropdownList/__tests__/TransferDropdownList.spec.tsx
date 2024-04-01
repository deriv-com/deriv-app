import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TransferDropdownList from '../TransferDropdownList';

jest.mock('../../TransferAccountTile', () => ({
    ...jest.requireActual('../../TransferAccountTile'),
    TransferAccountTile: jest.fn(({ account, isActive }) => (
        <span>
            TransferAccountTile-{account.loginid}-{String(isActive)}
        </span>
    )),
}));

const mockAccounts = [
    {
        loginid: 'CR1',
    },
    {
        loginid: 'CR2',
    },
];

const mockSelectedAccount = {
    loginid: 'CR2',
};

describe('<TransferDropdownList />', () => {
    it('should test if accounts are rendered properly under the correct header', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        render(<TransferDropdownList accounts={mockAccounts} header='Deriv Mt5 accounts' />);
        expect(screen.getByText('Deriv Mt5 accounts')).toBeInTheDocument();
        expect(screen.getByText('TransferAccountTile-CR1-false')).toBeInTheDocument();
    });

    it('should test if onSelect is triggered upon clicking the account', async () => {
        const mockOnSelect = jest.fn(account => {});
        //@ts-expect-error since this is a mock, we only need partial properties of accounts data
        render(<TransferDropdownList accounts={mockAccounts} header='Deriv Mt5 accounts' onSelect={mockOnSelect} />);
        const firstAccount = screen.getByText('TransferAccountTile-CR1-false');

        await fireEvent.click(firstAccount);

        expect(mockOnSelect).toBeCalledWith(mockAccounts[0]);
    });

    it('should test if selected account is passed with isActive prop as true', async () => {
        const mockOnSelect = jest.fn(account => {});
        render(
            <TransferDropdownList
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                accounts={mockAccounts}
                header='Deriv Mt5 accounts'
                onSelect={mockOnSelect}
                //@ts-expect-error since this is a mock, we only need partial properties of accounts data
                value={mockSelectedAccount}
            />
        );
        expect(screen.getByText('TransferAccountTile-CR2-true')).toBeInTheDocument();
    });
});
