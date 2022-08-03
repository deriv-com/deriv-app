/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
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
import CryptoFiatConverter from 'Components/crypto-fiat-converter';
import ErrorDialog from 'Components/error-dialog';
import PercentageSelector from 'Components/percentage-selector';
import RecentTransaction from 'Components/recent-transaction';
import SideNote from 'Components/side-note';
import './account-transfer-form.scss';

const AccountOption = ({ account, idx }) => (
    <React.Fragment key={idx}>
        {(account.currency || account.platform_icon) && (
            <div>
                <Icon
                    icon={account.platform_icon || `IcCurrency-${account.currency.toLowerCase()}`}
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

        <span className='account-transfer-form__balance'>
            <Money amount={account.balance} currency={account.currency} has_sign={account.balance < 0} show_currency />
        </span>
    </React.Fragment>
);

const AccountTransferBullet = ({ children }) => (
    <div className='account-transfer-form__bullet-wrapper'>
        <div className='account-transfer-form__bullet' />
        <Text size='xxs'>{children}</Text>
    </div>
);

const AccountTransferNote = ({
    allowed_transfers_count,
    currency,
    is_crypto_to_crypto_transfer,
    is_dxtrade_allowed,
    is_dxtrade_transfer,
    is_mt_transfer,
    transfer_fee,
    minimum_fee,
}) => {
    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;
    const platform_name_mt5 = getPlatformSettings('mt5').name;

    const getTransferFeeNote = () => {
        if (transfer_fee === 0) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We do not charge a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5 }}
                />
            ) : (
                <Localize
                    i18n_default_text='You’ll not be charged a transfer fee for transfers in the same currency between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 1) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts and between your Deriv fiat and {{platform_name_dxtrade}} accounts.'
                    values={{ platform_name_dxtrade, platform_name_mt5 }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 1% transfer fee for transfers in different currencies between your Deriv fiat and {{platform_name_mt5}} accounts.'
                    values={{ platform_name_mt5 }}
                />
            );
        } else if (transfer_fee === 2 && is_crypto_to_crypto_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && (is_mt_transfer || is_dxtrade_transfer)) {
            return is_dxtrade_allowed ? (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and DMT5 accounts and between your Deriv cryptocurrency and {{platform_name_dxtrade}} accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                        platform_name_dxtrade,
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv cryptocurrency and DMT5 accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        } else if (transfer_fee === 2 && !is_mt_transfer && !is_dxtrade_transfer) {
            return (
                <Localize
                    i18n_default_text='We’ll charge a 2% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts.'
                    values={{
                        minimum_fee,
                        currency: getCurrencyDisplayCode(currency),
                    }}
                />
            );
        }
        return null;
    };

    return (
        <div className='account-transfer-form__notes'>
            <AccountTransferBullet>
                {is_dxtrade_allowed ? (
                    <Localize
                        i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, {{platform_name_mt5}}, and {{platform_name_dxtrade}} accounts.'
                        values={{ platform_name_dxtrade, platform_name_mt5 }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='You may transfer between your Deriv fiat, cryptocurrency, and {{platform_name_mt5}} accounts.'
                        values={{ platform_name_mt5 }}
                    />
                )}
            </AccountTransferBullet>
            <AccountTransferBullet>
                {is_dxtrade_allowed ? (
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts, up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts, and up to {{ allowed_dxtrade }} transfers between your Deriv and {{platform_name_dxtrade}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count.internal,
                            allowed_mt5: allowed_transfers_count.mt5,
                            allowed_dxtrade: allowed_transfers_count.dxtrade,
                            platform_name_dxtrade,
                            platform_name_mt5,
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='Each day, you can make up to {{ allowed_internal }} transfers between your Deriv accounts and up to {{ allowed_mt5 }} transfers between your Deriv and {{platform_name_mt5}} accounts.'
                        values={{
                            allowed_internal: allowed_transfers_count.internal,
                            allowed_mt5: allowed_transfers_count.mt5,
                            platform_name_mt5,
                        }}
                    />
                )}
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfer limits may vary depending on the exchange rates.' />
            </AccountTransferBullet>
            <AccountTransferBullet>
                {getTransferFeeNote()}{' '}
                <Localize i18n_default_text='Please bear in mind that some transfers may not be possible.' />
            </AccountTransferBullet>
            <AccountTransferBullet>
                <Localize i18n_default_text='Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.' />
            </AccountTransferBullet>
        </div>
    );
};

let remaining_transfers;

let accounts_from = [];
let mt_accounts_from = [];
let dxtrade_accounts_from = [];
let accounts_to = [];
let mt_accounts_to = [];
let dxtrade_accounts_to = [];

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
    minimum_fee,
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
}) => {
    const [from_accounts, setFromAccounts] = React.useState({});
    const [to_accounts, setToAccounts] = React.useState({});
    const [transfer_to_hint, setTransferToHint] = React.useState();

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

    const validateAmount = amount => {
        if (!amount) return localize('This field is required.');

        const { is_ok, message } = validNumber(amount, {
            type: 'float',
            decimals: getDecimalPlaces(selected_from.currency),
            min: transfer_limit.min,
            max: transfer_limit.max,
        });
        if (!is_ok) return message;

        if (+selected_from.balance < +amount) return localize('Insufficient balance');

        return undefined;
    };

    const getAccounts = (type, { is_mt, is_dxtrade }) => {
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
            const text = <AccountOption idx={idx} account={account} />;
            const value = account.value;

            const is_cfd_account = account.is_mt || account.is_dxtrade;

            getAccounts('from', account).push({
                text,
                value,
                is_mt: account.is_mt,
                is_dxtrade: account.is_dxtrade,
                nativepicker_text: `${is_cfd_account ? account.market_type : getCurrencyName(account.currency)} (${
                    account.balance
                } ${is_cfd_account ? account.currency : account.text})`,
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
                    nativepicker_text: `${is_cfd_account ? account.market_type : getCurrencyName(account.currency)} (${
                        account.balance
                    } ${is_cfd_account ? account.currency : account.text})`,
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
    }, [accounts_list, selected_to, selected_from]);

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
    }, [transfer_fee, selected_from, selected_to, minimum_fee, from_accounts, is_dxtrade_allowed, crypto_transactions]);

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
            +remaining_transfers === 1
                ? localize('You have {{number}} transfer remaining for today.', { number: remaining_transfers })
                : localize('You have {{number}} transfers remaining for today.', { number: remaining_transfers });
        setTransferToHint(hint);
        resetConverter();
    }, [selected_to, selected_from, account_limits]);

    return (
        <div className='cashier__wrapper account-transfer-form__wrapper'>
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
                {({ errors, handleChange, isSubmitting, touched, setFieldValue, setFieldTouched, setFieldError }) => (
                    <React.Fragment>
                        {isSubmitting || accounts_list.length === 0 ? (
                            <div className='cashier__loader-wrapper'>
                                <Loading className='cashier__loader' is_fullscreen={false} />
                            </div>
                        ) : (
                            <Form noValidate>
                                <div className='cashier__drop-down-wrapper account-transfer-form__drop-down-wrapper'>
                                    <Dropdown
                                        id='transfer_from'
                                        className='account-transfer-form__drop-down'
                                        classNameDisplay='cashier__drop-down-display'
                                        classNameDisplaySpan='cashier__drop-down-display-span'
                                        classNameItems='cashier__drop-down-items'
                                        classNameLabel='cashier__drop-down-label'
                                        is_large
                                        label={localize('From')}
                                        list={from_accounts}
                                        list_height='404'
                                        name='transfer_from'
                                        value={selected_from.value}
                                        onChange={e => {
                                            onChangeTransferFrom(e);
                                            handleChange(e);
                                            setFieldValue('amount', '');
                                            setFieldError('amount', '');
                                            setFieldTouched('amount', false);
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
                                        is_large
                                        label={localize('To')}
                                        list={to_accounts}
                                        list_height='404'
                                        name='transfer_to'
                                        value={selected_to.value}
                                        onChange={e => {
                                            onChangeTransferTo(e);
                                            setFieldValue('amount', '');
                                            setFieldError('amount', '');
                                            setFieldTouched('amount', false);
                                        }}
                                        hint={transfer_to_hint}
                                        error={selected_to.error}
                                    />
                                </div>
                                {selected_from.currency === selected_to.currency ? (
                                    <Field name='amount' validate={validateAmount}>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                onChange={e => {
                                                    setErrorMessage('');
                                                    handleChange(e);
                                                    setAccountTransferAmount(e.target.value);
                                                    setFieldTouched('amount', true, false);
                                                }}
                                                className='cashier__input dc-input--no-placeholder account-transfer-form__input'
                                                classNameHint='account-transfer-form__hint'
                                                type='text'
                                                label={localize('Amount')}
                                                error={touched.amount && errors.amount ? errors.amount : ''}
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
                                <div className='cashier__form-submit account-transfer-form__form-submit'>
                                    <Button
                                        className='account-transfer-form__submit-button'
                                        type='submit'
                                        is_disabled={
                                            isSubmitting ||
                                            !+remaining_transfers ||
                                            !!selected_from.error ||
                                            !!selected_to.error ||
                                            !+selected_from.balance ||
                                            !!converter_from_error ||
                                            !!converter_to_error
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

AccountTransferForm.propTypes = {
    account_limits: PropTypes.object,
    accounts_list: PropTypes.array,
    account_transfer_amount: PropTypes.string,
    converter_from_amount: PropTypes.string,
    converter_from_error: PropTypes.string,
    converter_to_error: PropTypes.string,
    converter_to_amount: PropTypes.string,
    crypto_transactions: PropTypes.array,
    error: PropTypes.object,
    is_crypto: PropTypes.bool,
    is_dark_mode_on: PropTypes.bool,
    is_dxtrade_allowed: PropTypes.bool,
    minimum_fee: PropTypes.string,
    mt5_login_list: PropTypes.object,
    onChangeConverterFromAmount: PropTypes.func,
    onChangeConverterToAmount: PropTypes.func,
    onChangeTransferFrom: PropTypes.func,
    onChangeTransferTo: PropTypes.func,
    onMount: PropTypes.func,
    percentage: PropTypes.number,
    resetConverter: PropTypes.func,
    recentTransactionOnMount: PropTypes.func,
    requestTransferBetweenAccounts: PropTypes.func,
    selected_from: PropTypes.object,
    setAccountTransferAmount: PropTypes.func,
    setErrorMessage: PropTypes.func,
    selected_to: PropTypes.object,
    setTransferPercentageSelectorResult: PropTypes.func,
    setSideNotes: PropTypes.func,
    should_percentage_reset: PropTypes.bool,
    transfer_fee: PropTypes.number,
    transfer_limit: PropTypes.object,
    validateTransferFromAmount: PropTypes.func,
    validateTransferToAmount: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    account_limits: client.account_limits,
    accounts_list: modules.cashier.account_transfer.accounts_list,
    account_transfer_amount: modules.cashier.account_transfer.account_transfer_amount,
    converter_from_amount: modules.cashier.crypto_fiat_converter.converter_from_amount,
    converter_from_error: modules.cashier.crypto_fiat_converter.converter_from_error,
    converter_to_amount: modules.cashier.crypto_fiat_converter.converter_to_amount,
    converter_to_error: modules.cashier.crypto_fiat_converter.converter_to_error,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    is_crypto: modules.cashier.general_store.is_crypto,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    minimum_fee: modules.cashier.account_transfer.minimum_fee,
    onChangeConverterFromAmount: modules.cashier.crypto_fiat_converter.onChangeConverterFromAmount,
    onChangeConverterToAmount: modules.cashier.crypto_fiat_converter.onChangeConverterToAmount,
    onChangeTransferFrom: modules.cashier.account_transfer.onChangeTransferFrom,
    onChangeTransferTo: modules.cashier.account_transfer.onChangeTransferTo,
    onMount: client.getLimits,
    percentage: modules.cashier.general_store.percentage,
    resetConverter: modules.cashier.crypto_fiat_converter.resetConverter,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    requestTransferBetweenAccounts: modules.cashier.account_transfer.requestTransferBetweenAccounts,
    setAccountTransferAmount: modules.cashier.account_transfer.setAccountTransferAmount,
    setErrorMessage: modules.cashier.account_transfer.error.setErrorMessage,
    selected_from: modules.cashier.account_transfer.selected_from,
    selected_to: modules.cashier.account_transfer.selected_to,
    setTransferPercentageSelectorResult: modules.cashier.account_transfer.setTransferPercentageSelectorResult,
    should_percentage_reset: modules.cashier.general_store.should_percentage_reset,
    transfer_fee: modules.cashier.account_transfer.transfer_fee,
    transfer_limit: modules.cashier.account_transfer.transfer_limit,
    validateTransferFromAmount: modules.cashier.account_transfer.validateTransferFromAmount,
    validateTransferToAmount: modules.cashier.account_transfer.validateTransferToAmount,
}))(AccountTransferForm);
