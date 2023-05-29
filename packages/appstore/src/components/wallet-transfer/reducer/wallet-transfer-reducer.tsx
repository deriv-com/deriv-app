import React, { useCallback, useReducer } from 'react';
import { Badge } from '@deriv/components';
import { getDecimalPlaces } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import type { TAmountInput, TTransferAccountSelector, TWalletTile } from '../types';

const trading_account_names = [
    'Deriv Apps Demo',
    'MT5 Derived Demo',
    'MT5 Financial Demo',
    'MT5 Swap-free Demo',
    'Deriv EZ Demo',
    'Deriv X Demo',
    'Deriv cTrader Demo',
];

const accounts = [
    ...trading_account_names.map(
        (name, idx) =>
            ({
                loginid: idx.toString(),
                label: name,
                currency: 'usd',
                balance: '0.00',
                wallet_icon: 'IcCurrencyUsd',
                icon: 'IcDxtradeDerived',
                jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
                type: 'fiat',
            } as const)
    ),
];

const wallets = [
    {
        loginid: '7',
        label: 'Demo USD Wallet',
        currency: 'usd',
        balance: '10,000.00',
        wallet_icon: 'IcCurrencyUsd',
        jurisdiction: <Badge label='Demo' type='contained' background_color='blue' />,
        type: 'fiat',
    } as const,
];

const transfer_accounts = { accounts, wallets };

export type TWalletTransferState = {
    from_amount_input_props: TAmountInput;
    to_amount_input_props: TAmountInput;
    from_transfer_account_selector_props: TTransferAccountSelector;
    to_transfer_account_selector_props: TTransferAccountSelector;
};

// ACTION CREATORS
const setTransferAccountAC = (value: { label: string; account: TWalletTile['account'] }) => {
    return value.label === 'Transfer from'
        ? ({
              type: 'SET_TRANSFER_FROM_ACCOUNT',
              value: value.account,
          } as const)
        : ({ type: 'SET_TRANSFER_TO_ACCOUNT', value: value.account } as const);
};

// INITIAL STATE
const initial_state: TWalletTransferState = {
    from_amount_input_props: {
        currency: 'USD',
        label: localize('Amount you send'),
    },
    to_amount_input_props: {
        currency: '',
        decimal_places: 0,
        disabled: true,
        label: localize('Amount you receive'),
    },
    from_transfer_account_selector_props: {
        label: localize('Transfer from'),
        transfer_accounts,
        value: transfer_accounts.wallets[0],
        wallet_name: 'Demo USD Wallet',
    },
    to_transfer_account_selector_props: {
        label: localize('Transfer to'),
        placeholder: localize('Select a trading account or a Wallet'),
        transfer_accounts: { accounts },
        wallet_name: 'Demo USD Wallet',
        value: undefined,
        transfer_hint: '',
    },
};

const walletTransferReducer = (state: TWalletTransferState, action: TActionsTypes): TWalletTransferState => {
    switch (action.type) {
        case 'SET_TRANSFER_FROM_ACCOUNT': {
            // TODO: add property trading/wallet into account and check it below instead of label
            if (action.value.label !== 'Demo USD Wallet') {
                return {
                    ...state,
                    to_amount_input_props: {
                        ...state.to_amount_input_props,
                        disabled: false,
                        currency: action.value.currency.toUpperCase(),
                        decimal_places: getDecimalPlaces(action.value.currency),
                    },
                    from_transfer_account_selector_props: {
                        ...state.from_transfer_account_selector_props,
                        value: action.value,
                    },
                    to_transfer_account_selector_props: {
                        ...state.to_transfer_account_selector_props,
                        transfer_accounts: {
                            wallets: state.from_transfer_account_selector_props.transfer_accounts.wallets,
                        },
                        value: state.from_transfer_account_selector_props.transfer_accounts.wallets[0],
                    },
                };
            }
            return {
                ...state,
                to_amount_input_props: {
                    ...state.to_amount_input_props,
                    currency: '',
                    decimal_places: 0,
                    disabled: true,
                },
                to_transfer_account_selector_props: {
                    ...state.to_transfer_account_selector_props,
                    transfer_accounts: {
                        accounts: state.from_transfer_account_selector_props.transfer_accounts.accounts,
                    },
                    transfer_hint: '',
                    value: undefined,
                },
            };
        }
        case 'SET_TRANSFER_TO_ACCOUNT': {
            // TODO: add property trading/wallet into account and check it below instead of label
            if (action.value.label !== 'Demo USD Wallet') {
                return {
                    ...state,
                    to_amount_input_props: {
                        ...state.to_amount_input_props,
                        disabled: false,
                        currency: action.value.currency.toUpperCase(),
                        decimal_places: getDecimalPlaces(action.value.currency),
                    },
                    to_transfer_account_selector_props: {
                        ...state.to_transfer_account_selector_props,
                        value: action.value,
                    },
                };
            }
            return {
                ...state,
                to_transfer_account_selector_props: {
                    ...state.to_transfer_account_selector_props,
                    transfer_hint:
                        state.from_transfer_account_selector_props.transfer_accounts.wallets.length === 1 ? (
                            <Localize
                                i18n_default_text='You can only transfers funds from the {{account}} to the linked {{wallet}}.'
                                values={{
                                    account: state.from_transfer_account_selector_props.value?.label,
                                    wallet: state.from_transfer_account_selector_props.transfer_accounts.wallets[0]
                                        .label,
                                }}
                            />
                        ) : (
                            ''
                        ),
                },
            };
        }
        default:
            return state;
    }
};

export const useWalletTransferReducer = () => {
    const [wallet_transfer_state, dispatch] = useReducer(walletTransferReducer, initial_state);

    const setTransferAccount = useCallback(
        (value: { label: string; account: TWalletTile['account'] }) => dispatch(setTransferAccountAC(value)),
        []
    );

    return {
        wallet_transfer_state: {
            ...wallet_transfer_state,
            from_transfer_account_selector_props: {
                ...wallet_transfer_state.from_transfer_account_selector_props,
                onSelectAccount: setTransferAccount,
            },
            to_transfer_account_selector_props: {
                ...wallet_transfer_state.to_transfer_account_selector_props,
                onSelectAccount: setTransferAccount,
            },
        },
    };
};

type TActionsTypes = ReturnType<typeof setTransferAccountAC>;
