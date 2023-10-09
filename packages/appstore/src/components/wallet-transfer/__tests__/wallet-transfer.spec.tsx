import React from 'react';
import WalletTransfer from '../wallet-transfer';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

jest.mock('../components/transfer-account-selector/transfer-account-selector.tsx', () =>
    jest.fn(() => <div>TransferAccountSelector</div>)
);
jest.mock('../components/transfer-amount-input/transfer-amount-input.tsx', () =>
    jest.fn(() => <div>TransferAmountInput</div>)
);
jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({ data: undefined })),
}));

describe('WalletTransfer', () => {
    const mock = mockStore({
        client: {
            loginid: 'CRW1030',
            accounts: {
                CRW1030: {
                    token: 'token',
                },
            },
        },
    });

    it('Should render two amount inputs and two transfer account selectors', () => {
        render(
            <APIProvider>
                <StoreProvider store={mock}>
                    <WalletTransfer
                        contentScrollHandler={jest.fn()}
                        is_wallet_name_visible={false}
                        setIsWalletNameVisible={jest.fn()}
                    />
                </StoreProvider>
            </APIProvider>
        );

        expect(screen.getAllByText('TransferAmountInput')).toHaveLength(2);
        expect(screen.getAllByText('TransferAccountSelector')).toHaveLength(2);
    });
});
