import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TTransferableAccounts } from '../../../types';
import TransferReceipt from '../TransferReceipt';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    ReceiptScreen: jest.fn(({ actionButtons, fromElement, toElement }) => (
        <div>
            <div data-testid='dt_from_element'>{fromElement}</div>
            <div data-testid='dt_to_element'>{toElement}</div>
            <div>{actionButtons}</div>
        </div>
    )),
}));

jest.mock('../../TransferAccountIcon', () => ({
    ...jest.requireActual('../../TransferAccountIcon'),
    TransferAccountIcon: jest.fn(({ account }) => (
        <div>
            {account.account_type}-{account.currency}-icon
        </div>
    )),
}));

const mockFromAccount = {
    account_type: 'binary',
    currency: 'BTC',
    loginid: 'CR1',
} as TTransferableAccounts[number];

const mockToAccount = {
    account_type: 'mt5',
    currency: 'USD',
    loginid: 'CR2',
} as TTransferableAccounts[number];

describe('<TransferReceipt />', () => {
    it('should test if the action buttons are showing up', () => {
        render(
            <TransferReceipt
                amount='10.00'
                fromAccount={mockFromAccount}
                resetTransferReceipt={() => {}}
                toAccount={mockToAccount}
            />
        );

        expect(screen.getByText('View transaction details')).toBeInTheDocument();
        expect(screen.getByText('Make a new transfer')).toBeInTheDocument();
    });

    it('should test if reset function fires correctly after the user clicks on `Make a new transfer` button', () => {
        const mockResetFunction = jest.fn(arg => {});

        render(
            <TransferReceipt
                amount='10.00'
                fromAccount={mockFromAccount}
                resetTransferReceipt={mockResetFunction}
                toAccount={mockToAccount}
            />
        );

        userEvent.click(screen.getByText('Make a new transfer'));

        expect(mockResetFunction).toHaveBeenCalledWith(undefined);
    });

    it('should test if the source account details are rendered correctly', () => {
        render(
            <TransferReceipt
                amount='10.00'
                fromAccount={mockFromAccount}
                resetTransferReceipt={() => {}}
                toAccount={mockToAccount}
            />
        );

        const fromElement = screen.getByTestId('dt_from_element');

        expect(within(fromElement).getByText('CR1')).toBeInTheDocument();
        expect(within(fromElement).getByText('binary')).toBeInTheDocument();
        expect(within(fromElement).getByText('binary-BTC-icon')).toBeInTheDocument();
    });

    it('should test if the destination account details are rendered correctly', () => {
        render(
            <TransferReceipt
                amount='10.00'
                fromAccount={mockFromAccount}
                resetTransferReceipt={() => {}}
                toAccount={mockToAccount}
            />
        );

        const fromElement = screen.getByTestId('dt_to_element');

        expect(within(fromElement).getByText('CR2')).toBeInTheDocument();
        expect(within(fromElement).getByText('mt5')).toBeInTheDocument();
        expect(within(fromElement).getByText('mt5-USD-icon')).toBeInTheDocument();
    });
});
