import React from 'react';
import classNames from 'classnames';
import { Field, FieldProps, Formik, Form, FormikHelpers } from 'formik';
import { AmountInput, Button, Loading, MessageList, TransferAccountSelector } from '@deriv/components';
import { useTransferBetweenAccounts } from '@deriv/hooks';
//TODO: replace getCurrencyDisplayCode
import { getCurrencyDisplayCode, getDecimalPlaces, validNumber } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import './wallet-transfer.scss';

type TWalletTransferProps = {
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
    const { ui } = useStore();
    const { is_mobile } = ui;
    const {
        active_wallet,
        is_loading,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts,
        setFromAccount,
        setToAccount,
    } = useTransferBetweenAccounts();

    const portal_id = is_mobile ? 'mobile_list_modal_root' : 'modal_root';

    const is_amount_to_input_disabled = !to_account;

    const transfer_to_hint = React.useMemo(() => {
        return to_account?.label === active_wallet?.label ? (
            <Localize
                i18n_default_text='You can only transfers funds from the {{account}} to the linked {{wallet}}.'
                values={{
                    account: from_account?.label,
                    wallet: active_wallet?.label,
                }}
            />
        ) : (
            ''
        );
    }, [active_wallet?.label, from_account?.label, to_account?.label]);

    //mocked message list, remove after
    const mocked_message_list: React.ComponentProps<typeof MessageList>['list'] = [
        {
            id: '1',
            message: 'Hello world!',
            type: 'info',
        },
        {
            id: '2',
            message: 'Hello world!',
            type: 'error',
            button_label: 'Button',
        },
        {
            id: '3',
            message: 'Hello world!',
            type: 'success',
        },
    ];

    const [message_list, setMessageList] = React.useState<React.ComponentProps<typeof MessageList>['list']>([]);

    const clearErrorMessages = React.useCallback(
        () => setMessageList(list => list.filter(el => el.type !== 'error')),
        []
    );

    const validateAmount = (amount: number) => {
        clearErrorMessages();

        if (!amount || is_amount_to_input_disabled) return;

        if (active_wallet?.is_demo) {
            const { is_ok, message } = validNumber(amount.toString(), {
                type: 'float',
                decimals: getDecimalPlaces(from_account?.currency || ''),
                min: Number(1),
                max: from_account?.balance,
            });

            const should_reset_balance =
                amount > active_wallet?.balance && active_wallet?.balance < initial_demo_balance;

            if (from_account?.loginid === active_wallet.loginid && should_reset_balance) {
                setMessageList(list => {
                    if (list.some(el => el.id === ERROR_CODES.is_demo.insufficient_fund)) return list;
                    return [
                        ...list,
                        {
                            id: ERROR_CODES.is_demo.insufficient_fund,
                            button_label: localize('Reset balance'),
                            action: () => undefined,
                            message: localize(
                                'You have insufficient fund in the selected wallet, please reset your virtual balance'
                            ),
                            type: 'error',
                        },
                    ];
                });
            } else if (!is_ok) {
                //else if not wallet loginid and not is_ok message
                setMessageList(list => {
                    if (list.some(el => el.id === ERROR_CODES.is_demo.between_min_max)) return list;
                    return [
                        ...list,
                        {
                            id: ERROR_CODES.is_demo.between_min_max,
                            message: `${message} ${getCurrencyDisplayCode(from_account?.currency)}` || '',
                            type: 'error',
                        },
                    ];
                });
            }
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
            clearErrorMessages();
            resetForm();
        },
        [clearErrorMessages, from_account?.loginid, setFromAccount]
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

    if (is_loading) {
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
                                                from_account?.currency ? getDecimalPlaces(from_account?.currency) : 0
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
                                    wallet_name={active_wallet?.label}
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
                                                to_account?.currency ? getDecimalPlaces(to_account?.currency) : 0
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
                                    wallet_name={active_wallet?.label}
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
                                {localize('Transfer')}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <Button
                onClick={() => {
                    if (message_list.length === 0) {
                        setMessageList(mocked_message_list);
                    } else {
                        setMessageList([]);
                    }
                }}
            >
                Set messages
            </Button>
            <Button onClick={() => setMessageList(items => items.filter(item => item.id !== '4'))}>
                Remove message
            </Button>
            <Button
                onClick={() =>
                    setMessageList(items => [
                        ...items,
                        {
                            id: '4',
                            message: 'Hello world!',
                            type: 'error',
                        },
                    ])
                }
            >
                Add message
            </Button>
        </div>
    );
});

export default WalletTransfer;
