import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { THooks } from '../../../../../../../../../types';
import { getAccountName } from '../../../../../../../helpers';
import TransactionsCompletedRowTransferAccountDetails from '../TransactionsCompletedRowTransferAccountDetails';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

jest.mock('../../../../../../../helpers', () => ({
    getAccountName: jest.fn(),
}));

jest.mock('../../TransactionsCompletedRowAccountDetails', () => ({
    TransactionsCompletedRowAccountDetails: jest.fn(() => <div data-testid='mock-account-details' />),
}));

const mockAccounts: THooks.AllAccountsList = {
    ctrader: [
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        {
            account_id: 'CRW1111',
            currency: 'USD',
            is_virtual: false,
            platform: 'ctrader',
        },
    ],
    dtrade: [
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        {
            currency: 'USD',
            is_virtual: false,
            loginid: 'CRW2222',
            platform: 'deriv',
        },
    ],
    dxtrade: [
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        {
            account_id: 'CRW3333',
            currency: 'USD',
            is_virtual: false,
            platform: 'dxtrade',
        },
    ],
    mt5: [
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        {
            currency: 'USD',
            group: 'mt5_group',
            is_virtual: false,
            landing_company_name: 'svg',
            login: 'CRW4444',
            market_type: 'financial',
            platform: 'mt5',
        },
    ],
    wallets: [
        {
            currency: 'USD',
            // @ts-expect-error - since this is a mock, we only need partial properties of the account
            currency_config: {
                display_code: 'USD',
            },
            is_virtual: false,
            loginid: 'CRW5555',
            platform: 'deriv',
        },
    ],
};

const mockActiveWallet = {
    landing_company_name: 'svg',
};

describe('TransactionsCompletedRowTransferAccountDetails', () => {
    beforeEach(() => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockActiveWallet });
        (getAccountName as jest.Mock).mockReturnValue('USD Wallet');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with wallet account', () => {
        render(
            <TransactionsCompletedRowTransferAccountDetails
                accounts={mockAccounts}
                displayActionType='Transfer from'
                loginid='CRW5555'
            />
        );

        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
        expect(getAccountName).toHaveBeenCalledWith({
            accountCategory: 'wallet',
            accountType: 'wallet',
            displayCurrencyCode: 'USD',
            landingCompanyName: 'svg',
        });
    });

    it('renders the component with dtrade account', () => {
        render(
            <TransactionsCompletedRowTransferAccountDetails
                accounts={mockAccounts}
                displayActionType='Transfer from'
                loginid='CRW2222'
            />
        );

        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
        expect(getAccountName).toHaveBeenCalledWith({
            accountCategory: 'trading',
            accountType: 'standard',
            displayCurrencyCode: 'USD',
            landingCompanyName: 'svg',
        });
    });

    it('renders the component with dxtrade account', () => {
        render(
            <TransactionsCompletedRowTransferAccountDetails
                accounts={mockAccounts}
                displayActionType='Transfer from'
                loginid='CRW3333'
            />
        );

        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
        expect(getAccountName).toHaveBeenCalledWith({
            accountCategory: 'trading',
            accountType: 'dxtrade',
            displayCurrencyCode: 'USD',
            landingCompanyName: 'svg',
        });
    });

    it('renders the component with mt5 account', () => {
        render(
            <TransactionsCompletedRowTransferAccountDetails
                accounts={mockAccounts}
                displayActionType='Transfer from'
                loginid='CRW4444'
            />
        );

        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
        expect(getAccountName).toHaveBeenCalledWith({
            accountCategory: 'trading',
            accountType: 'mt5',
            displayCurrencyCode: 'USD',
            landingCompanyName: 'svg',
            mt5MarketType: 'financial',
        });
    });

    it('renders the component with ctrader account', () => {
        render(
            <TransactionsCompletedRowTransferAccountDetails
                accounts={mockAccounts}
                displayActionType='Transfer from'
                loginid='CRW1111'
            />
        );

        expect(screen.getByTestId('mock-account-details')).toBeInTheDocument();
        expect(getAccountName).toHaveBeenCalledWith({
            accountCategory: 'trading',
            accountType: 'ctrader',
            displayCurrencyCode: 'USD',
            landingCompanyName: 'svg',
        });
    });

    it('renders null if no matching account is found', () => {
        const { container } = render(
            <TransactionsCompletedRowTransferAccountDetails
                accounts={mockAccounts}
                displayActionType='Transfer from'
                loginid='CRW6666'
            />
        );

        expect(container).toBeEmptyDOMElement();
    });
});
