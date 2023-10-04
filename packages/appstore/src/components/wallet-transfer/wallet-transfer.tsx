import React, { useMemo, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Field, FieldProps, Formik, Form, FormikHelpers } from 'formik';
import debounce from 'lodash.debounce';
import { AmountInput, Button, Loading, MessageList } from '@deriv/components';
import { useExchangeRate, useWalletTransfer } from '@deriv/hooks';
import { useCurrencyConfig } from '@deriv/api';
import { validNumber } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import Timer from './timer';
import TransferAmountInput from './transfer-amount-input/transfer-amount-input';
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

export type TInitialValues = {
    to_amount: number;
    from_amount: number;
    to_account: ReturnType<typeof useWalletTransfer>['to_account'];
    from_account: ReturnType<typeof useWalletTransfer>['from_account'];
};

const WalletTransfer = observer(({ is_wallet_name_visible, setIsWalletNameVisible }: TWalletTransferProps) => {
    const { client, ui, traders_hub } = useStore();
    const { setWalletModalActiveTab } = traders_hub;
    const { is_switching } = client;
    const { is_mobile } = ui;

    const { getConfig } = useCurrencyConfig();

    const { getRate } = useExchangeRate();

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

    const is_amount_to_input_disabled = !to_account;

    const debounceFromConversion = useMemo(
        () =>
            debounce((value, setValues) => {
                const from_rate = getRate(from_account?.currency || '');
                const to_rate = getRate(to_account?.currency || '');
                const converted_amount = (value * to_rate) / from_rate;
                setValues({
                    from_amount: value,
                    to_amount: is_amount_to_input_disabled
                        ? 0
                        : Number(
                              converted_amount.toFixed(getConfig(to_account?.currency || '')?.fractional_digits || 0)
                          ),
                });
                setTimerKey(prev => prev + 1);
            }, 1000),
        [from_account?.currency, getConfig, getRate, is_amount_to_input_disabled, to_account?.currency]
    );

    const debounceToConversion = useMemo(
        () =>
            debounce((value, setValues) => {
                const from_rate = getRate(from_account?.currency || '');
                const to_rate = getRate(to_account?.currency || '');
                const converted_amount = (value * from_rate) / to_rate;
                setValues({
                    from_amount: Number(
                        converted_amount.toFixed(getConfig(from_account?.currency || '')?.fractional_digits || 0)
                    ),
                    to_amount: value,
                });
                setTimerKey(prev => prev + 1);
            }, 1000),
        [from_account?.currency, getConfig, getRate, to_account?.currency]
    );

    const [timer_key, setTimerKey] = useState(0);

    const portal_id = is_mobile ? 'mobile_list_modal_root' : 'modal_root';

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
                    // to_account,
                    // from_account,
                }}
                onSubmit={() => undefined}
                validateOnBlur={false}
            >
                {({ setValues, values, resetForm }) => {
                    const is_timer_visible = useMemo(() => {
                        const is_same_currency = from_account?.currency === to_account?.currency;
                        const is_zero_amount = values.to_amount === 0;
                        const is_error = message_list.some(el => el.type === 'error');

                        return !is_same_currency && !is_zero_amount && !is_error;
                    }, [values.to_amount, from_account?.currency, to_account?.currency]);

                    return (
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
                                                    if (from_account?.currency === to_account?.currency) {
                                                        setValues({
                                                            from_amount: value,
                                                            to_amount: is_amount_to_input_disabled ? 0 : value,
                                                        });
                                                    } else {
                                                        debounceFromConversion(value, setValues);
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
                                    <div className='tile__amount-with-timer'>
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
                                                    label={
                                                        from_account?.currency === to_account?.currency
                                                            ? localize('Amount you receive')
                                                            : localize('Estimated amount')
                                                    }
                                                    onChange={(value: number) => {
                                                        if (from_account?.currency === to_account?.currency) {
                                                            setValues({ from_amount: value, to_amount: value });
                                                        } else debounceToConversion(value, setValues);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                        {is_timer_visible && (
                                            <Timer
                                                key={timer_key}
                                                from={60}
                                                className='wallet-transfer__timer'
                                                onComplete={() => {
                                                    const from_rate = getRate(from_account?.currency || '');
                                                    const to_rate = getRate(to_account?.currency || '');
                                                    const converted_amount = (values.from_amount * to_rate) / from_rate;
                                                    setValues({
                                                        from_amount: values.from_amount,
                                                        to_amount: converted_amount,
                                                    });
                                                }}
                                            />
                                        )}
                                    </div>
                                    <Divider />
                                    <TransferAccountSelector
                                        is_mobile={is_mobile}
                                        is_wallet_name_visible={is_wallet_name_visible}
                                        label={localize('Transfer to')}
                                        onSelectAccount={account => onSelectToAccount(account, resetForm)}
                                        placeholder={
                                            !to_account ? localize('Select a trading account or a Wallet') : ''
                                        }
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
                    );
                }}
            </Formik>
        </div>
    );
});

export default WalletTransfer;
