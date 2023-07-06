import React from 'react';
import TransferAccountSelector from '../transfer-account-selector';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

jest.mock('../../transfer-account-selector/transfer-tile', () => jest.fn(() => <div>Transfer Tile</div>));
jest.mock('../../transfer-account-selector/transfer-account-list', () =>
    jest.fn(() => <div>Transfer Account List</div>)
);

describe('TransferAccountSelector', () => {
    let modal_root_el: HTMLDivElement, mocked_props: React.ComponentProps<typeof TransferAccountSelector>;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mocked_props = {
            is_mobile: false,
            is_wallet_name_visible: false,
            label: 'Transfer from',
            onSelectAccount: jest.fn(),
            placeholder: 'Placeholder',
            portal_id: 'modal_root',
            setIsWalletNameVisible: jest.fn(),
            transfer_accounts: {
                accounts: [],
                wallets: [],
            },
            transfer_hint: 'Transfer hint',
            value: undefined,
            wallet_name: 'USD Wallet',
        };
    });

    it('Should render transfer tile by default', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        expect(screen.getByText('Transfer Tile')).toBeInTheDocument();
    });

    it('Should render TransferAccountList when the user is clicking on Transfer selector', () => {
        render(<TransferAccountSelector {...mocked_props} />);

        const el_transfer_tile = screen.getByTestId('dt_transfer_account_selector');
        userEvent.click(el_transfer_tile);

        expect(screen.getByText('Transfer Account List')).toBeInTheDocument();
    });
});
