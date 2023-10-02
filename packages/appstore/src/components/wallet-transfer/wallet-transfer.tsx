import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, Formik, Form, FormikHelpers } from 'formik';
import { AmountInput, Button, Loading, MessageList } from '@deriv/components';
import { useWalletTransfer, useCurrencyConfig } from '@deriv/hooks';
import { validNumber } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import TransferAccountSelector from './transfer-account-selector';
import { getAccountName } from 'Constants/utils';
import type { TMessageItem } from 'Types';
import './wallet-transfer.scss';

type TWalletTransferProps = {
    contentScrollHandler: React.UIEventHandler<HTMLDivElement>;
    is_wallet_name_visible: boolean;
    setIsWalletNameVisible: (value: boolean) => void;
};

const Divider = () => <div className='wallet-transfer__divider' />;

const initial_demo_balance = 10000.0;

const ERROR_CODES = {
    is_demo: {
        between_min_max: 'BetweenMinMax',
        insufficient_fund: 'InsufficientFund',
    },
};

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

    useEffect(() => {
        if (!from_account?.loginid) {
            setFromAccount(active_wallet);
        }
    }, [active_wallet, from_account, setFromAccount]);

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

    const [message_list, setMessageList] = React.useState<TMessageItem[]>([]);

    const clearErrorMessages = React.useCallback(
        () => setMessageList(list => list.filter(el => el.type !== 'error')),
        []
    );

    const appendMessage = (error_code: string, message: TMessageItem) => {
        setMessageList(list => {
            if (list.some(el => el.key === error_code)) return list;
            return [...list, message];
        });
    };

    const validateAmount = (amount: number) => {
        clearErrorMessages();

        if (!amount || is_amount_to_input_disabled || !active_wallet?.is_demo) return;

        const { is_ok, message } = validNumber(amount.toString(), {
            type: 'float',
            decimals: getConfig(from_account?.currency ?? '')?.fractional_digits,
            min: 1,
            max: from_account?.balance,
        });

        const should_reset_balance =
            active_wallet?.balance !== undefined &&
            amount > active_wallet?.balance &&
            active_wallet?.balance < initial_demo_balance;

        if (from_account?.loginid === active_wallet.loginid && should_reset_balance) {
            appendMessage(ERROR_CODES.is_demo.insufficient_fund, {
                variant: 'with-action-button',
                key: ERROR_CODES.is_demo.insufficient_fund,
                button_label: localize('Reset balance'),
                onClickHandler: () => setWalletModalActiveTab('Deposit'),
                message: localize(
                    'You have insufficient fund in the selected wallet, please reset your virtual balance'
                ),
                type: 'error',
            });
        } else if (!is_ok) {
            //else if not wallet loginid and not is_ok message
            appendMessage(ERROR_CODES.is_demo.between_min_max, {
                variant: 'base',
                key: ERROR_CODES.is_demo.between_min_max,
                message: `${message} ${from_account?.display_currency_code}`,
                type: 'error',
            });
        }
    };

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
            clearErrorMessages();
            resetForm();
        },
        [active_wallet, clearErrorMessages, from_account?.loginid, setFromAccount, setToAccount]
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
            clearErrorMessages();
            resetForm();
        },
        [clearErrorMessages, setToAccount, to_account?.loginid]
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
                            <div
                                className={classNames('wallet-transfer__tile', {
                                    'wallet-transfer__tile-disable-margin-bottom': message_list.length > 0,
                                })}
                            >
                                <Field name='from_amount' validate={validateAmount}>
                                    {({ field }: FieldProps<number>) => (
                                        <AmountInput
                                            {...field}
                                            currency={from_account?.currency || ''}
                                            decimal_places={
                                                getConfig(from_account?.currency || '')?.fractional_digits || 0
                                            }
                                            disabled={false}
                                            has_error={message_list.some(el => el.type === 'error')}
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
                            <MessageList list={message_list} />
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
                                            has_error={message_list.some(el => el.type === 'error')}
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
                                disabled={
                                    is_amount_to_input_disabled ||
                                    values.to_amount === 0 ||
                                    message_list.some(el => el.type === 'error')
                                }
                            >
                                <Localize i18n_default_text='Transfer' />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
});

export default WalletTransfer;
