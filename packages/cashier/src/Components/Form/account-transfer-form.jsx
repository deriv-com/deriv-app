/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, Dropdown, Icon, Input, Loading, Money, DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, getCurrencyName, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import CryptoFiatConverter from './crypto-fiat-converter.jsx';
import FormError from '../Error/form-error.jsx';
import PercentageSelector from '../percentage-selector';
import RecentTransaction from '../recent-transaction.jsx';
import '../../Sass/account-transfer.scss';

const AccountOption = ({ mt5_login_list, account, idx, is_dark_mode_on }) => {
    let server;

    if (account.is_mt) {
        server = mt5_login_list.find(mt5_account => mt5_account.login === account.value);
    }

    return (
        <React.Fragment key={idx}>
            {(account.currency || account.platform_icon) && (
                <div>
                    <Icon
                        icon={account.platform_icon || `IcCurrency-${account.currency.toLowerCase()}`}
                        className='account-transfer__currency-icon'
                    />
                </div>
            )}

            <div className='account-transfer__currency-wrapper'>
                <Text size='xxs' line_height='xs' styles={{ color: 'inherit', fontWeight: 'inherit' }}>
                    {account.is_dxtrade || account.is_mt ? account.text : getCurrencyName(account.currency)}
                </Text>
                <Text size='xxxs' align='left' color='less-prominent'>
                    {account.value}
                </Text>
            </div>

            {(server?.market_type === 'gaming' || server?.market_type === 'synthetic') && (
                <Text color={is_dark_mode_on ? 'general' : 'colored-background'} size='xxs' className='badge-server'>
                    {server.server_info.geolocation.region}&nbsp;
                    {server.server_info.geolocation.sequence !== 1 ? server.server_info.geolocation.sequence : ''}
                </Text>
            )}

            <span className='account-transfer__balance'>
                <Money
                    amount={account.balance}
                    currency={account.currency}
                    has_sign={account.balance < 0}
                    show_currency
                />
            </span>
        </React.Fragment>
    );
};

const AccountTransferBullet = ({ children }) => (
    <div className='account-transfer__bullet-wrapper'>
        <div className='account-transfer__bullet' />
        <span>{children}</span>
    </div>
);

const AccountTransferNote = ({ currency, transfer_fee, minimum_fee, is_dxtrade_allowed }) => (
    <div className='account-transfer__notes'>
        <DesktopWrapper>
            <Text as='h2' color='prominent' weight='bold' className='cashier__header account-transfer__notes-header'>
                <Localize i18n_default_text='Notes' />
            </Text>
        </DesktopWrapper>
        <AccountTransferBullet>
            <Localize i18n_default_text='Transfer limits may vary depending on changes in exchange rates.' />
        </AccountTransferBullet>
        <AccountTransferBullet>
            <Localize
                i18n_default_text='Transfers are subject to a {{transfer_fee}}% transfer fee or {{minimum_fee}} {{currency}}, whichever is higher.'
                values={{
                    transfer_fee,
                    minimum_fee,
                    currency: getCurrencyDisplayCode(currency),
                }}
            />
        </AccountTransferBullet>
        <AccountTransferBullet>
            {is_dxtrade_allowed ? (
                <Localize i18n_default_text='Transfers are possible only between your fiat and cryptocurrency accounts, your Deriv account and Deriv MT5 (DMT5) account, or your Deriv account and Deriv X account.' />
            ) : (
                <Localize i18n_default_text='Transfers are possible only between your fiat and cryptocurrency accounts, or your Deriv account and Deriv MT5 (DMT5) account.' />
            )}
        </AccountTransferBullet>
        <AccountTransferBullet>
            <Localize i18n_default_text='Transfers may be unavailable when the market is closed (weekends or holidays), periods of high volatility, or when there are technical issues.' />
        </AccountTransferBullet>
    </div>
);

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
    is_dark_mode_on,
    minimum_fee,
    mt5_login_list,
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
            if (account_server?.market_type === 'gaming' || account_server?.market_type === 'synthetic') {
                server_region = `[${account_server.server_info.geolocation.region}${
                    account_server.server_info.geolocation.sequence !== 1
                        ? account_server.server_info.geolocation.sequence
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
                const is_selected_from_crypto = selected_from.is_crypto && account.is_crypto;

                // cannot transfer to MT account from MT
                // cannot transfer to crypto account from crypto
                // cannot transfer to Dxtrade account from Dxtrade

                const is_disabled = is_selected_from_mt || is_selected_from_crypto || is_selected_from_dxtrade;

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
            ...(dxtrade_accounts_from.length && { [localize('Deriv X accounts')]: dxtrade_accounts_from }),
            ...(accounts_from.length && { [localize('Deriv accounts')]: accounts_from }),
        });

        setToAccounts({
            ...(mt_accounts_to.length && { [localize('DMT5 accounts')]: mt_accounts_to }),
            ...(dxtrade_accounts_to.length && { [localize('Deriv X accounts')]: dxtrade_accounts_to }),
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
                    transfer_fee={transfer_fee}
                    currency={selected_from.currency}
                    minimum_fee={minimum_fee}
                    key={0}
                    is_dxtrade_allowed={is_dxtrade_allowed}
                />
            );
            setSideNotes(side_notes);
        }
    }, [transfer_fee, selected_from, minimum_fee, from_accounts, is_dxtrade_allowed, crypto_transactions]);

    React.useEffect(() => {
        const { daily_transfers } = account_limits;
        const mt5_remaining_transfers = daily_transfers?.mt5?.available;
        const dxtrade_remaining_transfers = daily_transfers?.dxtrade?.available;
        const internal_remaining_transfers = daily_transfers?.internal?.available;

        const is_mt_transfer = selected_to.is_mt || selected_from.is_mt;
        const is_dxtrade_transfer = selected_to.is_dxtrade || selected_from.is_dxtrade;

        const getRemainingTransfers = () => {
            if (is_mt_transfer) {
                return mt5_remaining_transfers;
            } else if (is_dxtrade_transfer) {
                return dxtrade_remaining_transfers;
            }
            return internal_remaining_transfers;
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
        <div className='cashier__wrapper account-transfer__wrapper'>
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
                            <Form>
                                <div className='cashier__drop-down-wrapper account-transfer__drop-down-wrapper'>
                                    <Dropdown
                                        id='transfer_from'
                                        className='cashier__drop-down account-transfer__drop-down'
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
                                        className='cashier__drop-down account-transfer__drop-down account-transfer__drop-down--to-dropdown'
                                        classNameDisplay='cashier__drop-down-display'
                                        classNameDisplaySpan='cashier__drop-down-display-span'
                                        classNameItems='cashier__drop-down-items'
                                        classNameLabel='cashier__drop-down-label'
                                        classNameHint='cashier__hint'
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
                                                className='cashier__input dc-input--no-placeholder account-transfer__input'
                                                classNameHint='cashier__hint'
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
                                        <div className='crypto-account-transfer__percentage-selector'>
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
                                            validateFromAmount={validateTransferFromAmount}
                                            validateToAmount={validateTransferToAmount}
                                        />
                                    </div>
                                )}
                                <div className='cashier__form-submit cashier__form-submit--align-end account-transfer__form-submit'>
                                    <Button
                                        className={classNames({
                                            'cashier__form-submit-button':
                                                selected_from.currency === selected_to.currency,
                                            'cashier__account-transfer__form-submit-button':
                                                selected_from.currency !== selected_to.currency,
                                        })}
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
                                <MobileWrapper>
                                    {is_crypto && crypto_transactions?.length ? <RecentTransaction /> : null}
                                    <AccountTransferNote
                                        transfer_fee={transfer_fee}
                                        currency={selected_from.currency}
                                        minimum_fee={minimum_fee}
                                        is_dxtrade_allowed={is_dxtrade_allowed}
                                    />
                                </MobileWrapper>
                                <FormError error={error} />
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
    minimum_fee: PropTypes.string,
    onChangeTransferFrom: PropTypes.func,
    onChangeTransferTo: PropTypes.func,
    onMount: PropTypes.func,
    percentage: PropTypes.number,
    resetConverter: PropTypes.func,
    recentTransactionOnMount: PropTypes.func,
    requestTransferBetweenAccounts: PropTypes.func,
    selected_from: PropTypes.object,
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

export default connect(({ client, modules, ui }) => ({
    account_limits: client.account_limits,
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    account_transfer_amount: modules.cashier.config.account_transfer.account_transfer_amount,
    converter_from_amount: modules.cashier.converter_from_amount,
    converter_from_error: modules.cashier.converter_from_error,
    converter_to_amount: modules.cashier.converter_to_amount,
    converter_to_error: modules.cashier.converter_to_error,
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    is_crypto: modules.cashier.is_crypto,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_dxtrade_allowed: client.is_dxtrade_allowed,
    minimum_fee: modules.cashier.config.account_transfer.minimum_fee,
    mt5_login_list: client.mt5_login_list,
    onChangeTransferFrom: modules.cashier.onChangeTransferFrom,
    onChangeTransferTo: modules.cashier.onChangeTransferTo,
    onMount: client.getLimits,
    percentage: modules.cashier.percentage,
    resetConverter: modules.cashier.resetConverter,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    requestTransferBetweenAccounts: modules.cashier.requestTransferBetweenAccounts,
    setAccountTransferAmount: modules.cashier.setAccountTransferAmount,
    setErrorMessage: modules.cashier.setErrorMessage,
    selected_from: modules.cashier.config.account_transfer.selected_from,
    selected_to: modules.cashier.config.account_transfer.selected_to,
    setTransferPercentageSelectorResult: modules.cashier.setTransferPercentageSelectorResult,
    should_percentage_reset: modules.cashier.should_percentage_reset,
    transfer_fee: modules.cashier.config.account_transfer.transfer_fee,
    transfer_limit: modules.cashier.config.account_transfer.transfer_limit,
    validateTransferFromAmount: modules.cashier.validateTransferFromAmount,
    validateTransferToAmount: modules.cashier.validateTransferToAmount,
}))(AccountTransferForm);
