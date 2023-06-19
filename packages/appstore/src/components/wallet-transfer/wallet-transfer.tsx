import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { AmountInput, TransferAccountSelector, Button } from '@deriv/components';
import { getDecimalPlaces } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
// TODO: 'transfer_accounts' should be replaced after connecting to API call
import { transfer_accounts } from './mock_accounts/mock_accounts';
import './wallet-transfer.scss';

type TAccount = React.ComponentProps<typeof TransferAccountSelector>['value'];

type TWalletTransferProps = {
    is_wallet_name_visible: boolean;
    setIsWalletNameVisible: (value: boolean) => void;
};

const Divider = () => <div className='wallet-transfer__divider' />;

const WalletTransfer = observer(({ is_wallet_name_visible, setIsWalletNameVisible }: TWalletTransferProps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const [from_account, setFromAccount] = React.useState<TAccount>(transfer_accounts.wallets[0]);
    const [to_account, setToAccount] = React.useState<TAccount>();

    const portal_id = is_mobile ? 'mobile_list_modal_root' : 'modal_root';

    const to_account_list = React.useMemo(() => {
        // TODO: 'Demo USD Wallet' should be replaced to the current open wallet after connecting to API call
        if (from_account?.label === 'Demo USD Wallet') {
            setToAccount(undefined);
            return { accounts: transfer_accounts.accounts, wallets: [] };
        }
        setToAccount(transfer_accounts.wallets[0]);
        return { wallets: transfer_accounts.wallets, accounts: [] };
    }, [from_account?.label]);

    const transfer_to_hint = React.useMemo(() => {
        // TODO: 'Demo USD Wallet' should be replaced to the current open wallet after connecting to API call
        return to_account?.label === 'Demo USD Wallet' ? (
            <Localize
                i18n_default_text='You can only transfers funds from the {{account}} to the linked {{wallet}}.'
                values={{
                    account: from_account?.label,
                    wallet: transfer_accounts.wallets[0].label,
                }}
            />
        ) : (
            ''
        );
    }, [from_account?.label, to_account?.label]);

    const is_amount_to_input_disabled = !to_account;

    return (
        <div className='wallet-transfer'>
            <Formik
                initialValues={{
                    to_amount: 0,
                    from_amount: 0,
                }}
                onSubmit={() => undefined}
                validateOnBlur={false}
            >
                {({ setFieldValue, values }) => {
                    const onSelectToAccount = React.useCallback(
                        (account: TAccount) => {
                            setToAccount(account);
                            setFieldValue('to_amount', values.from_amount);
                        },
                        [setFieldValue, values.from_amount]
                    );

                    const onSelectFromAccount = React.useCallback(
                        (account: TAccount) => {
                            setFromAccount(account);
                            if (account?.label === 'Demo USD Wallet') {
                                setFieldValue('to_amount', 0);
                            }
                        },
                        [setFieldValue]
                    );

                    return (
                        <Form noValidate>
                            <div className='wallet-transfer__tiles-container'>
                                <div className='wallet-transfer__tile'>
                                    <Field name='from_amount'>
                                        {({ field }: FieldProps<number>) => (
                                            <AmountInput
                                                {...field}
                                                currency={from_account?.currency || ''}
                                                decimal_places={
                                                    from_account?.currency
                                                        ? getDecimalPlaces(from_account?.currency)
                                                        : 0
                                                }
                                                disabled={false}
                                                initial_value={field.value}
                                                label={localize('Amount you send')}
                                                onChange={(value: number) => {
                                                    setFieldValue('from_amount', value);
                                                    if (!is_amount_to_input_disabled) {
                                                        setFieldValue('to_amount', value);
                                                    }
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <Divider />
                                    <TransferAccountSelector
                                        is_mobile={is_mobile}
                                        is_wallet_name_visible={is_wallet_name_visible}
                                        label={localize('Transfer from')}
                                        onSelectAccount={onSelectFromAccount}
                                        placeholder={localize('Select a trading account or a Wallet')}
                                        portal_id={portal_id}
                                        setIsWalletNameVisible={setIsWalletNameVisible}
                                        transfer_accounts={transfer_accounts}
                                        // TODO: 'Demo USD Wallet' should be replaced to the current open wallet after connecting to API call
                                        wallet_name='Demo USD Wallet'
                                        value={from_account}
                                    />
                                </div>
                                <div className='wallet-transfer__tile'>
                                    <Field name='to_amount'>
                                        {({ field }: FieldProps<number>) => (
                                            <AmountInput
                                                {...field}
                                                currency={to_account?.currency || ''}
                                                decimal_places={
                                                    to_account?.currency ? getDecimalPlaces(from_account?.currency) : 0
                                                }
                                                disabled={is_amount_to_input_disabled}
                                                initial_value={field.value}
                                                label={localize('Amount you receive')}
                                                onChange={(value: number) => {
                                                    setFieldValue('from_amount', value);
                                                    setFieldValue('to_amount', value);
                                                }}
                                            />
                                        )}
                                    </Field>
                                    <Divider />
                                    <TransferAccountSelector
                                        is_mobile={is_mobile}
                                        is_wallet_name_visible={is_wallet_name_visible}
                                        label={localize('Transfer to')}
                                        onSelectAccount={onSelectToAccount}
                                        placeholder={
                                            !to_account ? localize('Select a trading account or a Wallet') : ''
                                        }
                                        portal_id={portal_id}
                                        setIsWalletNameVisible={setIsWalletNameVisible}
                                        transfer_accounts={to_account_list}
                                        transfer_hint={transfer_to_hint}
                                        // TODO: 'Demo USD Wallet' should be replaced to the current open wallet after connecting to API call
                                        wallet_name='Demo USD Wallet'
                                        value={to_account}
                                    />
                                </div>
                            </div>
                            <div className='wallet-transfer__transfer-button'>
                                <Button
                                    primary
                                    large
                                    type='submit'
                                    disabled={is_amount_to_input_disabled || values.to_amount === 0}
                                >
                                    {localize('Transfer')}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
});

export default WalletTransfer;
