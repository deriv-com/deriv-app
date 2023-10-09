import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import TransferAccountSelector from '../transfer-account-selector';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

jest.mock('../transfer-account-list', () => jest.fn(() => <div>TransferAccountList</div>));
jest.mock('../../wallet-transfer-tile/wallet-transfer-tile.tsx', () => jest.fn(() => <div>WalletTransferTile</div>));

describe('TransferAccountSelector', () => {
    let modal_root_el: HTMLDivElement, mocked_props: React.ComponentProps<typeof TransferAccountSelector>;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mocked_props = {
            name: 'from_account',
            setIsWalletNameVisible: jest.fn(),
            contentScrollHandler: jest.fn(),
            is_wallet_name_visible: false,
        };

        mockUseFormikContext.mockReturnValue({
            values: {
                from_account: undefined,
                to_account: undefined,
            },
            setErrors: jest.fn(),
            setFieldValue: jest.fn(),
        });
    });

    const mocked_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mocked_store}>{children}</StoreProvider>
    );

    it('Should render placeholder, if there is no selected account', () => {
        mockUseFormikContext.mockReturnValue({
            values: {
                from_account: undefined,
                to_account: {},
            },
            setErrors: jest.fn(),
            setFieldValue: jest.fn(),
        });

        render(<TransferAccountSelector {...mocked_props} />, { wrapper });

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('Select a trading account or a Wallet')).toBeInTheDocument();
        expect(screen.getByTestId('dt_chevron_icon')).toBeInTheDocument();
    });

    it('Should render WalletTransferTile if the account was selected', () => {
        mockUseFormikContext.mockReturnValue({
            values: {
                from_account: {
                    active_wallet_icon: 'Icon',
                    display_currency_code: 'USD',
                    account_type: 'wallet',
                    balance: 100,
                    currency: 'USD',
                    gradient_class: 'wallet-card__usd-bg',
                    is_demo: false,
                    loginid: '12345678',
                    shortcode: 'svg',
                    type: 'fiat',
                    icon: 'Wallet Icon',
                },
                to_account: {},
            },
            setErrors: jest.fn(),
            setFieldValue: jest.fn(),
        });

        render(<TransferAccountSelector {...mocked_props} />, { wrapper });

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
        expect(screen.getByText('WalletTransferTile')).toBeInTheDocument();
        expect(screen.getByTestId('dt_chevron_icon')).toBeInTheDocument();
    });

    it('Should render TransferAccountList when the user is clicking on Transfer selector', () => {
        render(<TransferAccountSelector {...mocked_props} />, { wrapper });

        const el_transfer_tile = screen.getByTestId('dt_transfer_account_selector');
        userEvent.click(el_transfer_tile);

        expect(screen.getByText('TransferAccountList')).toBeInTheDocument();
    });

    it('Should render proper label', () => {
        render(<TransferAccountSelector {...mocked_props} />, { wrapper });

        expect(screen.getByText('Transfer from')).toBeInTheDocument();
    });
});
