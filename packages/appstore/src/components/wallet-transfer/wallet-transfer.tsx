import React from 'react';
import { Field, FieldProps, Formik, Form, FormikHelpers } from 'formik';
import { AmountInput, Button, Loading } from '@deriv/components';
import { useCurrencyConfig, useWalletTransfer } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import TransferAccountSelector from './transfer-account-selector';
import { getAccountName } from 'Constants/utils';
import './wallet-transfer.scss';
import { WalletTransferMessages } from './components/wallet-transfer-messages';

type TWalletTransferProps = {
    contentScrollHandler: React.UIEventHandler<HTMLDivElement>;
    is_wallet_name_visible: boolean;
    setIsWalletNameVisible: (value: boolean) => void;
};

const Divider = () => <div className='wallet-transfer__divider' />;

const WalletTransfer = observer(({ is_wallet_name_visible, setIsWalletNameVisible }: TWalletTransferProps) => {
    const { client, ui, traders_hub } = useStore();
    const { setWalletModalActiveTab } = traders_hub;
    const { is_switching } = client;
    const { is_mobile } = ui;

    const { getConfig } = useCurrencyConfig();

    const {
        active_wallet,
        is_accounts_loading,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts,
        setFromAccount,
        setToAccount,
    } = useWalletTransfer();

    const portal_id = is_mobile ? 'mobile_list_modal_root' : 'modal_root';

    const is_amount_to_input_disabled = !to_account;

    const active_wallet_name = getAccountName({ ...active_wallet });

    const transfer_to_hint = React.useMemo(() => {
        return to_account?.loginid === active_wallet?.loginid ? (
            <Localize
                i18n_default_text='You can only transfers funds from the {{account}} to the linked {{wallet}}.'
                values={{
                    account: getAccountName({ ...from_account }),
                    wallet: active_wallet_name,
                }}
            />
        ) : (
            ''
        );
    }, [active_wallet?.loginid, active_wallet_name, from_account, to_account?.loginid]);

    const onSelectFromAccount = React.useCallback(
        (
            account: typeof from_account,
            resetForm: FormikHelpers<{
                to_amount: number;
                from_amount: number;
            }>['resetForm']
        ) => {
            if (account?.loginid === from_account?.loginid) return;
            setFromAccount(account);
            if (account?.loginid === active_wallet?.loginid) {
                setToAccount(undefined);
            } else {
                setToAccount(active_wallet);
            }
            resetForm();
        },
        [active_wallet, from_account?.loginid, setFromAccount, setToAccount]
    );

    const onSelectToAccount = React.useCallback(
        (
            account: typeof to_account,
            resetForm: FormikHelpers<{
                to_amount: number;
                from_amount: number;
            }>['resetForm']
        ) => {
            if (account?.loginid === to_account?.loginid) return;
            setToAccount(account);
            resetForm();
        },
        [setToAccount, to_account?.loginid]
    );

    if (is_accounts_loading || is_switching) {
        return <Loading is_fullscreen={false} />;
    }

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
                {({ setValues, values, resetForm }) => (
                    <Form noValidate>
                        <div className='wallet-transfer__tiles-container'>
                            <div className='wallet-transfer__tile'>
                                <Field name='from_amount'>
                                    {({ field }: FieldProps<number>) => (
                                        <AmountInput
                                            {...field}
                                            currency={from_account?.currency || ''}
                                            decimal_places={
                                                getConfig(from_account?.currency || '')?.fractional_digits || 0
                                            }
                                            disabled={false}
                                            initial_value={field.value}
                                            label={localize('Amount you send')}
                                            onChange={(value: number) => {
                                                setValues({
                                                    from_amount: value,
                                                    to_amount: is_amount_to_input_disabled ? 0 : value,
                                                });
                                            }}
                                        />
                                    )}
                                </Field>
                                <Divider />
                                <TransferAccountSelector
                                    //add key to reset the selector state when value updated
                                    key={JSON.stringify(from_account)}
                                    is_mobile={is_mobile}
                                    is_wallet_name_visible={is_wallet_name_visible}
                                    label={localize('Transfer from')}
                                    onSelectAccount={account => onSelectFromAccount(account, resetForm)}
                                    placeholder={localize('Select a trading account or a Wallet')}
                                    portal_id={portal_id}
                                    setIsWalletNameVisible={setIsWalletNameVisible}
                                    transfer_accounts={transfer_accounts}
                                    wallet_name={active_wallet_name}
                                    value={from_account}
                                />
                            </div>
                            <WalletTransferMessages
                                from_account={from_account}
                                to_account={to_account}
                                // setMessageList={setMessageList} - TODO: add this line later for managing input error messages
                            />
                            <div className='wallet-transfer__tile'>
                                <Field name='to_amount'>
                                    {({ field }: FieldProps<number>) => (
                                        <AmountInput
                                            {...field}
                                            currency={to_account?.currency || ''}
                                            decimal_places={
                                                getConfig(to_account?.currency || '')?.fractional_digits || 0
                                            }
                                            disabled={is_amount_to_input_disabled}
                                            initial_value={field.value}
                                            label={localize('Amount you receive')}
                                            onChange={(value: number) => {
                                                setValues({ from_amount: value, to_amount: value });
                                            }}
                                        />
                                    )}
                                </Field>
                                <Divider />
                                <TransferAccountSelector
                                    //add key to reset the selector state when value updated
                                    key={JSON.stringify(to_account)}
                                    is_mobile={is_mobile}
                                    is_wallet_name_visible={is_wallet_name_visible}
                                    label={localize('Transfer to')}
                                    onSelectAccount={account => onSelectToAccount(account, resetForm)}
                                    placeholder={!to_account ? localize('Select a trading account or a Wallet') : ''}
                                    portal_id={portal_id}
                                    setIsWalletNameVisible={setIsWalletNameVisible}
                                    transfer_accounts={to_account_list}
                                    transfer_hint={transfer_to_hint}
                                    wallet_name={active_wallet_name}
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
                )}
            </Formik>
        </div>
    );
});

export default WalletTransfer;
