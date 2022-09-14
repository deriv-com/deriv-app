import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { Button, Dropdown, Icon, Input, Loading, Money, Text } from '@deriv/components';
import {
    getDecimalPlaces,
    getCurrencyDisplayCode,
    getCurrencyName,
    getPlatformSettings,
    validNumber,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import {
    TRootStore,
    TClientStore,
    TUiStore,
    TReactChangeEvent,
    TAccount,
    TAccountsList,
    TCryptoTransactionDetails,
} from 'Types';
import CryptoFiatConverter from 'Components/crypto-fiat-converter';
import ErrorDialog from 'Components/error-dialog';
import PercentageSelector from 'Components/percentage-selector';
import RecentTransaction from 'Components/recent-transaction';
import AccountTransferNote from './account-transfer-form-side-note';
import SideNote from 'Components/side-note';
import './account-transfer-form.scss';

type TSelect = {
    currency: string;
    balance: number;
    is_dxtrade: boolean;
    is_crypto: boolean;
    is_mt: boolean;
    value: string;
    error: string;
};

type TAccountTransferFormProps = {
    account_limits: TClientStore['account_limits'];
    account_transfer_amount: string;
    accounts_list: Array<TAccount>;
    converter_from_amount: string;
    converter_from_error: string;
    converter_to_amount: string;
    converter_to_error: string;
    crypto_transactions: Array<TCryptoTransactionDetails>;
    error: object;
    is_crypto: boolean;
    is_dark_mode_on: TUiStore['is_dark_mode_on'];
    is_dxtrade_allowed: TClientStore['is_dxtrade_allowed'];
    minimum_fee: string;
    mt5_login_list: TClientStore['mt5_login_list'];
    onChangeConverterFromAmount: () => void;
    onChangeConverterToAmount: () => void;
    onChangeTransferFrom: (event: TReactChangeEvent) => void;
    onChangeTransferTo: (event: TReactChangeEvent) => void;
    onMount: TClientStore['getLimits'];
    percentage: number;
    recentTransactionOnMount: () => void;
    requestTransferBetweenAccounts: ({ amount }: { amount: number }) => void;
    resetConverter: () => void;
    selected_from: TSelect;
    selected_to: TSelect;
    setAccountTransferAmount: (amount: string) => void;
    setErrorMessage: (message: string) => void;
    setSideNotes: (notes: Array<string | JSX.Element | JSX.Element[]> | null) => void;
    setTransferPercentageSelectorResult: () => void;
    should_percentage_reset: boolean;
    transfer_fee: number;
    transfer_limit: {
        min: number;
        max: number;
    };
    validateTransferFromAmount: () => void;
    validateTransferToAmount: () => void;
};

const AccountOption = ({ mt5_login_list, account, idx, is_dark_mode_on }: TAccountsList) => {
    let server;

    if (account.is_mt) {
        server = mt5_login_list.find(mt5_account => mt5_account.login === account.value);
    }

    return (
        <React.Fragment key={idx}>
            {(account.currency || account.platform_icon) && (
                <div>
                    <Icon
                        icon={account.platform_icon || `IcCurrency-${account?.currency?.toLowerCase()}`}
                        className='account-transfer-form__currency-icon'
                    />
                </div>
            )}

            <div className='account-transfer-form__currency-wrapper'>
                <Text size='xxs' line_height='xs' styles={{ color: 'inherit', fontWeight: 'inherit' }}>
                    {account.is_dxtrade || account.is_mt ? account.text : getCurrencyName(account.currency)}
                </Text>
                <Text size='xxxs' align='left' color='less-prominent'>
                    {account.value}
                </Text>
            </div>

            {server?.market_type === 'synthetic' && (
                <Text color={is_dark_mode_on ? 'general' : 'colored-background'} size='xxs' className='badge-server'>
                    {server.server_info?.geolocation?.region}&nbsp;
                    {server.server_info?.geolocation?.sequence !== 1 ? server.server_info?.geolocation?.sequence : ''}
                </Text>
            )}

            <span className='account-transfer-form__balance'>
                <Money
                    amount={account.balance}
                    currency={account.currency}
                    has_sign={account.balance && account.balance < 0}
                    show_currency
                />
            </span>
        </React.Fragment>
    );
};

let remaining_transfers: boolean | undefined;
let accounts_from: Array<TAccount> = [];
let mt_accounts_from: Array<TAccount> = [];
let dxtrade_accounts_from: Array<TAccount> = [];
let accounts_to: Array<TAccount> = [];
let mt_accounts_to: Array<TAccount> = [];
let dxtrade_accounts_to: Array<TAccount> = [];

const AccountTransferForm = ({
    account_limits,
    accounts_list,
    account_transfer_amount,
    converter_from_amount,
    converter_from_error,
    converter_to_amount,
    converter_to_error,
    crypto_transactions,
    error,
    is_crypto,
    is_dxtrade_allowed,
    is_dark_mode_on,
    minimum_fee,
    mt5_login_list,
    onChangeConverterFromAmount,
    onChangeConverterToAmount,
    onChangeTransferFrom,
    onChangeTransferTo,
    onMount,
    percentage,
    resetConverter,
    recentTransactionOnMount,
    requestTransferBetweenAccounts,
    setErrorMessage,
    setTransferPercentageSelectorResult,
    selected_from,
    selected_to,
    setAccountTransferAmount,
    setSideNotes,
    should_percentage_reset,
    transfer_fee,
    transfer_limit,
    validateTransferFromAmount,
    validateTransferToAmount,
}: TAccountTransferFormProps) => {
    const [from_accounts, setFromAccounts] = React.useState({});
    const [to_accounts, setToAccounts] = React.useState({});
    const [transfer_to_hint, setTransferToHint] = React.useState<string>();

    const { daily_transfers } = account_limits;
    const mt5_remaining_transfers = daily_transfers?.mt5;
    const dxtrade_remaining_transfers = daily_transfers?.dxtrade;
    const internal_remaining_transfers = daily_transfers?.internal;

    const is_mt_transfer = selected_to.is_mt || selected_from.is_mt;
    const is_dxtrade_transfer = selected_to.is_dxtrade || selected_from.is_dxtrade;

    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;

    React.useEffect(() => {
        recentTransactionOnMount();
    }, [recentTransactionOnMount]);

    const validateAmount = (amount: string) => {
        if (!amount) return localize('This field is required.');

        const { is_ok, message } = validNumber(amount, {
            type: 'float',
            decimals: getDecimalPlaces(selected_from.currency),
            min: transfer_limit.min,
            max: transfer_limit.max,
        });
        if (!is_ok) return message;

        if (selected_from.balance && +selected_from.balance < +amount) return localize('Insufficient balance');

        return undefined;
    };

    const shouldShowTransferButton = (amount: string) => {
        return selected_from.currency === selected_to.currency ? !amount : !converter_from_amount;
    };

    const getAccounts = (type: string, { is_mt, is_dxtrade }: TAccount) => {
        if (type === 'from') {
            if (is_mt) return mt_accounts_from;
            if (is_dxtrade) return dxtrade_accounts_from;
            return accounts_from;
        } else if (type === 'to') {
            if (is_mt) return mt_accounts_to;
            if (is_dxtrade) return dxtrade_accounts_to;
            return accounts_to;
        }
        return [];
    };

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    React.useEffect(() => {
        accounts_from = [];
        mt_accounts_from = [];
        dxtrade_accounts_from = [];
        accounts_to = [];
        mt_accounts_to = [];
        dxtrade_accounts_to = [];

        accounts_list.forEach((account, idx) => {
            const text = (
                <AccountOption
                    mt5_login_list={mt5_login_list}
                    idx={idx}
                    account={account}
                    is_dark_mode_on={is_dark_mode_on}
                />
            );
            const value = account.value;
            const account_server = mt5_login_list.find(server => server.login === account.value);

            const is_cfd_account = account.is_mt || account.is_dxtrade;
            let server_region = '';
            if (account_server?.market_type === 'synthetic') {
                server_region = `[${account_server.server_info?.geolocation?.region}${
                    account_server.server_info?.geolocation?.sequence !== 1
                        ? account_server.server_info?.geolocation?.sequence
                        : ''
                }]`;
            }

            getAccounts('from', account).push({
                text,
                value,
                is_mt: account.is_mt,
                is_dxtrade: account.is_dxtrade,
                nativepicker_text: `${
                    is_cfd_account ? account.market_type : getCurrencyName(account.currency)
                } ${server_region} (${account.balance} ${is_cfd_account ? account.currency : account.text})`,
            });
            const is_selected_from = account.value === selected_from.value;

            if ((selected_from.is_mt && account.is_dxtrade) || (selected_from.is_dxtrade && account.is_mt)) return;

            // account from and to cannot be the same
            if (!is_selected_from) {
                const is_selected_from_mt = selected_from.is_mt && account.is_mt;
                const is_selected_from_dxtrade = selected_from.is_dxtrade && account.is_dxtrade;

                // cannot transfer to MT account from MT
                // cannot transfer to Dxtrade account from Dxtrade

                const is_disabled = is_selected_from_mt || is_selected_from_dxtrade;

                getAccounts('to', account).push({
                    text,
                    value,
                    is_mt: account.is_mt,
                    is_dxtrade: account.is_dxtrade,
                    disabled: is_disabled,
                    nativepicker_text: `${
                        is_cfd_account ? account.market_type : getCurrencyName(account.currency)
                    } ${server_region} (${account.balance} ${is_cfd_account ? account.currency : account.text})`,
                });
            }
        });

        setFromAccounts({
            ...(mt_accounts_from.length && { [localize('DMT5 accounts')]: mt_accounts_from }),
            ...(dxtrade_accounts_from.length && {
                [localize('{{platform_name_dxtrade}} accounts', { platform_name_dxtrade })]: dxtrade_accounts_from,
            }),
            ...(accounts_from.length && { [localize('Deriv accounts')]: accounts_from }),
        });

        setToAccounts({
            ...(mt_accounts_to.length && { [localize('DMT5 accounts')]: mt_accounts_to }),
            ...(dxtrade_accounts_to.length && {
                [localize('{{platform_name_dxtrade}} accounts', { platform_name_dxtrade })]: dxtrade_accounts_to,
            }),
            ...(accounts_to.length && { [localize('Deriv accounts')]: accounts_to }),
        });
    }, [accounts_list, selected_to, selected_from]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        if (Object.keys(from_accounts).length && typeof setSideNotes === 'function') {
            const side_notes = [];
            if (is_crypto && crypto_transactions?.length) {
                side_notes.push(<RecentTransaction key={2} />);
            }
            side_notes.push(
                <AccountTransferNote
                    allowed_transfers_count={{
                        internal: internal_remaining_transfers?.allowed,
                        mt5: mt5_remaining_transfers?.allowed,
                        dxtrade: dxtrade_remaining_transfers?.allowed,
                    }}
                    transfer_fee={transfer_fee}
                    currency={selected_from.currency}
                    minimum_fee={minimum_fee}
                    key={0}
                    is_crypto_to_crypto_transfer={selected_from.is_crypto && selected_to.is_crypto}
                    is_dxtrade_allowed={is_dxtrade_allowed}
                    is_dxtrade_transfer={is_dxtrade_transfer}
                    is_mt_transfer={is_mt_transfer}
                />
            );
            setSideNotes([
                <SideNote title={<Localize i18n_default_text='Notes' />} key={0}>
                    {side_notes}
                </SideNote>,
            ]);
        }
    }, [transfer_fee, selected_from, selected_to, minimum_fee, from_accounts, is_dxtrade_allowed, crypto_transactions]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        const getRemainingTransfers = () => {
            if (is_mt_transfer) {
                return mt5_remaining_transfers?.available;
            } else if (is_dxtrade_transfer) {
                return dxtrade_remaining_transfers?.available;
            }
            return internal_remaining_transfers?.available;
        };

        remaining_transfers = getRemainingTransfers();

        const hint =
            remaining_transfers && +remaining_transfers === 1
                ? localize('You have {{number}} transfer remaining for today.', { number: remaining_transfers })
                : localize('You have {{number}} transfers remaining for today.', { number: remaining_transfers });
        setTransferToHint(hint);
        resetConverter();
    }, [selected_to, selected_from, account_limits]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='cashier__wrapper account-transfer-form__wrapper' data-testid='dt_account_transfer_form_wrapper'>
            <Text
                as='h2'
                color='prominent'
                weight='bold'
                align='center'
                className='cashier__header cashier__content-header'
            >
                {localize('Transfer between your accounts in Deriv')}
            </Text>
            <Formik
                initialValues={{
                    amount: account_transfer_amount || '',
                    converter_from_amount: converter_from_amount || '',
                    converter_to_amount: converter_to_amount || '',
                }}
                onSubmit={() => {
                    requestTransferBetweenAccounts({ amount: +account_transfer_amount });
                }}
                validateOnBlur={false}
                enableReinitialize
            >
                {({ errors, handleChange, isSubmitting, setFieldValue, setFieldError, values }) => (
                    <React.Fragment>
                        {isSubmitting || accounts_list.length === 0 ? (
                            <div className='cashier__loader-wrapper' data-testid='dt_cashier_loader_wrapper'>
                                <Loading className='cashier__loader' is_fullscreen={false} />
                            </div>
                        ) : (
                            <Form noValidate>
                                <div
                                    className='cashier__drop-down-wrapper account-transfer-form__drop-down-wrapper'
                                    data-testid='dt_account_transfer_form_drop_down_wrapper'
                                >
                                    <Dropdown
                                        id='transfer_from'
                                        className='account-transfer-form__drop-down'
                                        classNameDisplay='cashier__drop-down-display'
                                        classNameDisplaySpan='cashier__drop-down-display-span'
                                        classNameItems='cashier__drop-down-items'
                                        classNameLabel='cashier__drop-down-label'
                                        test_id='dt_account_transfer_form_drop_down'
                                        is_large
                                        label={localize('From')}
                                        list={from_accounts}
                                        list_height='404'
                                        name='transfer_from'
                                        value={selected_from.value}
                                        onChange={(e: TReactChangeEvent) => {
                                            onChangeTransferFrom(e);
                                            handleChange(e);
                                            setFieldValue('amount', '');
                                            setTimeout(() => setFieldError('amount', ''));
                                        }}
                                        error={selected_from.error}
                                    />
                                    <Dropdown
                                        id='transfer_to'
                                        className='account-transfer-form__drop-down account-transfer-form__drop-down--to-dropdown'
                                        classNameDisplay='cashier__drop-down-display'
                                        classNameDisplaySpan='cashier__drop-down-display-span'
                                        classNameItems='cashier__drop-down-items'
                                        classNameLabel='cashier__drop-down-label'
                                        classNameHint='account-transfer-form__hint'
                                        test_id='dt_account_transfer_form_to_dropdown'
                                        is_large
                                        label={localize('To')}
                                        list={to_accounts}
                                        list_height='404'
                                        name='transfer_to'
                                        value={selected_to.value}
                                        onChange={(e: TReactChangeEvent) => {
                                            onChangeTransferTo(e);
                                            setFieldValue('amount', '');
                                            setTimeout(() => setFieldError('amount', ''));
                                        }}
                                        hint={transfer_to_hint}
                                        error={selected_to.error}
                                    />
                                </div>
                                {selected_from.currency === selected_to.currency ? (
                                    <Field name='amount' validate={validateAmount}>
                                        {({ field }: FieldProps<string>) => (
                                            <Input
                                                {...field}
                                                onChange={(e: { target: { value: string } }) => {
                                                    setErrorMessage('');
                                                    handleChange(e);
                                                    setAccountTransferAmount(e.target.value);
                                                }}
                                                className='cashier__input dc-input--no-placeholder account-transfer-form__input'
                                                classNameHint='account-transfer-form__hint'
                                                data-testid='dt_account_transfer_form_input'
                                                name='amount'
                                                type='text'
                                                label={localize('Amount')}
                                                error={errors.amount ? errors.amount : ''}
                                                required
                                                trailing_icon={
                                                    selected_from.currency ? (
                                                        <span
                                                            className={classNames(
                                                                'symbols',
                                                                `symbols--${selected_from.currency.toLowerCase()}`
                                                            )}
                                                        >
                                                            {getCurrencyDisplayCode(selected_from.currency)}
                                                        </span>
                                                    ) : undefined
                                                }
                                                autoComplete='off'
                                                maxLength='30'
                                                hint={
                                                    transfer_limit.max ? (
                                                        <Localize
                                                            i18n_default_text='Transfer limits: <0 /> - <1 />'
                                                            components={[
                                                                <Money
                                                                    key={0}
                                                                    amount={transfer_limit.min}
                                                                    currency={selected_from.currency}
                                                                    show_currency
                                                                />,
                                                                <Money
                                                                    key={1}
                                                                    amount={transfer_limit.max}
                                                                    currency={selected_from.currency}
                                                                    show_currency
                                                                />,
                                                            ]}
                                                        />
                                                    ) : (
                                                        ''
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                ) : (
                                    <div>
                                        <div className='account-transfer-form__crypto--percentage-selector'>
                                            <PercentageSelector
                                                amount={+selected_from.balance}
                                                currency={selected_from.currency}
                                                from_account={selected_from.value}
                                                getCalculatedAmount={setTransferPercentageSelectorResult}
                                                percentage={percentage}
                                                should_percentage_reset={should_percentage_reset}
                                                to_account={selected_to.value}
                                            />
                                        </div>
                                        <CryptoFiatConverter
                                            from_currency={selected_from.currency}
                                            to_currency={selected_to.currency}
                                            hint={
                                                transfer_limit.max ? (
                                                    <Localize
                                                        i18n_default_text='Transfer limits: <0 /> - <1 />'
                                                        components={[
                                                            <Money
                                                                key={0}
                                                                amount={transfer_limit.min}
                                                                currency={selected_from.currency}
                                                                show_currency
                                                            />,
                                                            <Money
                                                                key={1}
                                                                amount={transfer_limit.max}
                                                                currency={selected_from.currency}
                                                                show_currency
                                                            />,
                                                        ]}
                                                    />
                                                ) : (
                                                    ''
                                                )
                                            }
                                            onChangeConverterFromAmount={onChangeConverterFromAmount}
                                            onChangeConverterToAmount={onChangeConverterToAmount}
                                            resetConverter={resetConverter}
                                            validateFromAmount={validateTransferFromAmount}
                                            validateToAmount={validateTransferToAmount}
                                        />
                                    </div>
                                )}
                                <div
                                    className='cashier__form-submit account-transfer-form__form-submit'
                                    data-testid='dt_account_transfer_form_submit'
                                >
                                    <Button
                                        className='account-transfer-form__submit-button'
                                        type='submit'
                                        is_disabled={
                                            isSubmitting ||
                                            (remaining_transfers && !+remaining_transfers) ||
                                            !!selected_from.error ||
                                            !!selected_to.error ||
                                            !+selected_from.balance ||
                                            !!converter_from_error ||
                                            !!converter_to_error ||
                                            !!errors.amount ||
                                            shouldShowTransferButton(values.amount)
                                        }
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Transfer' />
                                    </Button>
                                </div>
                                <SideNote title={<Localize i18n_default_text='Notes' />} is_mobile>
                                    {is_crypto && crypto_transactions?.length ? <RecentTransaction /> : null}
                                    <AccountTransferNote
                                        allowed_transfers_count={{
                                            internal: internal_remaining_transfers?.allowed,
                                            mt5: mt5_remaining_transfers?.allowed,
                                            dxtrade: dxtrade_remaining_transfers?.allowed,
                                        }}
                                        transfer_fee={transfer_fee}
                                        currency={selected_from.currency}
                                        minimum_fee={minimum_fee}
                                        is_crypto_to_crypto_transfer={selected_from.is_crypto && selected_to.is_crypto}
                                        is_dxtrade_allowed={is_dxtrade_allowed}
                                        is_dxtrade_transfer={is_dxtrade_transfer}
                                        is_mt_transfer={is_mt_transfer}
                                    />
                                </SideNote>
                                <ErrorDialog error={error} />
                            </Form>
                        )}
                    </React.Fragment>
                )}
            </Formik>
        </div>
    );
};

export default connect(({ client, modules, ui }: TRootStore) => ({
    account_limits: client.account_limits,
    account_transfer_amount: modules.cashier.account_transfer.account_transfer_amount,
    accounts_list: modules.cashier.account_transfer.accounts_list,
    converter_from_amount: modules.cashier.crypto_fiat_converter.converter_from_amount,
    converter_from_error: modules.cashier.crypto_fiat_converter.converter_from_error,
    converter_to_amount: modules.cashier.crypto_fiat_converter.converter_to_amount,
    converter_to_error: modules.cashier.crypto_fiat_converter.converter_to_error,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    is_crypto: modules.cashier.general_store.is_crypto,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    minimum_fee: modules.cashier.account_transfer.minimum_fee,
    mt5_login_list: client.mt5_login_list,
    onChangeConverterFromAmount: modules.cashier.crypto_fiat_converter.onChangeConverterFromAmount,
    onChangeConverterToAmount: modules.cashier.crypto_fiat_converter.onChangeConverterToAmount,
    onChangeTransferFrom: modules.cashier.account_transfer.onChangeTransferFrom,
    onChangeTransferTo: modules.cashier.account_transfer.onChangeTransferTo,
    onMount: client.getLimits,
    percentage: modules.cashier.general_store.percentage,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    requestTransferBetweenAccounts: modules.cashier.account_transfer.requestTransferBetweenAccounts,
    resetConverter: modules.cashier.crypto_fiat_converter.resetConverter,
    selected_from: modules.cashier.account_transfer.selected_from,
    selected_to: modules.cashier.account_transfer.selected_to,
    setAccountTransferAmount: modules.cashier.account_transfer.setAccountTransferAmount,
    setErrorMessage: modules.cashier.account_transfer.error.setErrorMessage,
    setTransferPercentageSelectorResult: modules.cashier.account_transfer.setTransferPercentageSelectorResult,
    should_percentage_reset: modules.cashier.general_store.should_percentage_reset,
    transfer_fee: modules.cashier.account_transfer.transfer_fee,
    transfer_limit: modules.cashier.account_transfer.transfer_limit,
    validateTransferFromAmount: modules.cashier.account_transfer.validateTransferFromAmount,
    validateTransferToAmount: modules.cashier.account_transfer.validateTransferToAmount,
}))(AccountTransferForm);
