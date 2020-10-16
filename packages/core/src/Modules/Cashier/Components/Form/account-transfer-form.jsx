import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, Dropdown, Icon, Input, Money, DesktopWrapper, MobileWrapper, SelectNative } from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber, website_name } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import FormError from '../Error/form-error.jsx';
import Loading from '../../../../templates/_common/components/loading.jsx';

const AccountOption = ({ account, idx }) => {
    return (
        <React.Fragment key={idx}>
            {(account.currency || account.mt_icon) && (
                <div>
                    <Icon
                        icon={
                            account.mt_icon
                                ? `IcMt5-${account.mt_icon}`
                                : `IcCurrency-${account.currency.toLowerCase()}`
                        }
                        className='account-transfer__currency-icon'
                    />
                </div>
            )}

            <div className='account-transfer__currency-wrapper'>
                <span className='account-transfer__currency'>{account.text}</span>
                <span className='account-transfer__loginid'>{account.value}</span>
            </div>

            <span className='account-transfer__balance cashier__drop-down-display-brackets'>
                <Money amount={account.balance} currency={account.currency} />
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

const AccountTransferNote = ({
    currency,
    transfer_fee,
    minimum_fee,
    internal_total_transfers,
    mt5_total_transfers,
}) => (
    <div className='account-transfer__notes'>
        <DesktopWrapper>
            <div className='cashier__header account-transfer__notes-header'>
                <Localize i18n_default_text='Notes' />
            </div>
        </DesktopWrapper>
        <AccountTransferBullet>
            <Localize
                i18n_default_text='Daily transfer limits: up to {{number_deriv}} times for Deriv accounts, and up to {{number_dmt5}} times for DMT5 accounts.'
                values={{
                    number_deriv: internal_total_transfers,
                    number_dmt5: mt5_total_transfers,
                }}
            />
        </AccountTransferBullet>
        <AccountTransferBullet>
            <Localize i18n_default_text='Transfer limits may vary depending on the exchange rates.' />
        </AccountTransferBullet>
        <AccountTransferBullet>
            <Localize
                i18n_default_text='We’ll charge a {{transfer_fee}}% transfer fee, or {{minimum_fee}} {{currency}}, whichever is higher.'
                values={{
                    transfer_fee,
                    minimum_fee,
                    currency: getCurrencyDisplayCode(currency),
                }}
            />
        </AccountTransferBullet>
        <AccountTransferBullet>
            <Localize
                i18n_default_text='You may transfer between your fiat and cryptocurrency accounts or between your {{website_name}} and DMT5 accounts.'
                values={{ website_name }}
            />
        </AccountTransferBullet>
        <AccountTransferBullet>
            <Localize i18n_default_text='Transfers may be unavailable when the exchange markets are closed, when there is high volatility, or when there are technical issues.' />
        </AccountTransferBullet>
    </div>
);

const AccountTransferForm = ({
    onMount,
    transfer_limit,
    account_limits,
    selected_from,
    selected_to,
    requestTransferBetweenAccounts,
    accounts_list,
    setSideNotes,
    transfer_fee,
    minimum_fee,
    onChangeTransferFrom,
    onChangeTransferTo,
    setErrorMessage,
    error,
}) => {
    const validateAmount = amount => {
        if (!amount) return localize('This field is required.');

        const { is_ok, message } = validNumber(amount, {
            type: 'float',
            decimals: getDecimalPlaces(selected_from.currency),
            min: transfer_limit.min,
            max: transfer_limit.max,
        });
        if (!is_ok) return message;

        if (+selected_from.balance < +amount) return localize('Insufficient balance.');

        return undefined;
    };

    const onTransferPassthrough = async (values, actions) => {
        const transfer_between_accounts = await requestTransferBetweenAccounts({
            amount: +values.amount,
        });
        if (transfer_between_accounts?.error) {
            actions.setSubmitting(false);
        }
    };

    const accounts_from = [];
    const mt_accounts_from = [];
    const accounts_to = [];
    const mt_accounts_to = [];

    accounts_list.forEach((account, idx) => {
        const text = <AccountOption idx={idx} account={account} />;
        const value = account.value;
        (account.is_mt ? mt_accounts_from : accounts_from).push({
            text,
            value,
            nativepicker_text: `${account.text} (${account.currency} ${account.balance})`,
        });
        const is_selected_from = account.value === selected_from.value;
        // account from and to cannot be the same
        if (!is_selected_from) {
            const is_selected_from_mt = selected_from.is_mt && account.is_mt;
            const is_selected_from_crypto = selected_from.is_crypto && account.is_crypto;
            // cannot transfer to MT account from MT
            // cannot transfer to crypto account from crypto
            const is_disabled = is_selected_from_mt || is_selected_from_crypto;
            (account.is_mt ? mt_accounts_to : accounts_to).push({
                text,
                value,
                disabled: is_disabled,
                nativepicker_text: `${account.text} (${account.currency} ${account.balance})`,
            });
        }
    });

    const from_accounts = {
        ...(mt_accounts_from.length && { [localize('DMT5 accounts')]: mt_accounts_from }),
        ...(accounts_from.length && { [localize('Deriv accounts')]: accounts_from }),
    };

    const to_accounts = {
        ...(mt_accounts_to.length && { [localize('DMT5 accounts')]: mt_accounts_to }),
        ...(accounts_to.length && { [localize('Deriv accounts')]: accounts_to }),
    };

    const { daily_transfers } = account_limits;
    const mt5_remaining_transfers = daily_transfers?.mt5?.available;
    const internal_remaining_transfers = daily_transfers?.internal?.available;
    const mt5_total_transfers = daily_transfers?.mt5?.allowed;
    const internal_total_transfers = daily_transfers?.internal?.allowed;

    const is_mt_transfer = selected_to.is_mt || selected_from.is_mt;
    const remaining_transfers = is_mt_transfer ? mt5_remaining_transfers : internal_remaining_transfers;

    const transfer_to_hint =
        +remaining_transfers === 1
            ? localize('You have {{number}} transfer remaining for today.', { number: remaining_transfers })
            : localize('You have {{number}} transfers remaining for today.', { number: remaining_transfers });

    React.useEffect(() => {
        onMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (Object.keys(from_accounts).length && typeof setSideNotes === 'function') {
            setSideNotes([
                <AccountTransferNote
                    mt5_total_transfers={mt5_total_transfers}
                    internal_total_transfers={internal_total_transfers}
                    transfer_fee={transfer_fee}
                    currency={selected_from.currency}
                    minimum_fee={minimum_fee}
                    key={0}
                />,
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transfer_fee, selected_from, minimum_fee, mt5_total_transfers, internal_total_transfers, setSideNotes]);
    return (
        <div className='cashier__wrapper account-transfer__wrapper'>
            <React.Fragment>
                <h2 className='cashier__header cashier__content-header'>
                    {localize('Transfer between your accounts in Deriv')}
                </h2>
                <Formik
                    initialValues={{
                        amount: '',
                    }}
                    onSubmit={onTransferPassthrough}
                >
                    {({
                        errors,
                        isSubmitting,
                        isValid,
                        touched,
                        validateField,
                        setFieldValue,
                        setFieldError,
                        handleChange,
                    }) => (
                        <React.Fragment>
                            {isSubmitting ? (
                                <div className='cashier__loader-wrapper'>
                                    <Loading className='cashier__loader' />
                                </div>
                            ) : (
                                <Form>
                                    <div className='cashier__drop-down-wrapper account-transfer__drop-down-wrapper'>
                                        <DesktopWrapper>
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
                                                    validateField('amount');
                                                    setFieldValue('amount', '');
                                                    setFieldError('amount', '');
                                                }}
                                                error={selected_from.error}
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                placeholder={localize('Please select')}
                                                className='account-transfer__transfer-from'
                                                classNameDisplay='cashier__drop-down-display'
                                                name='transfer_from'
                                                label={localize('From')}
                                                value={selected_from.value}
                                                list_items={from_accounts}
                                                onChange={e => {
                                                    onChangeTransferFrom(e);
                                                    handleChange(e);
                                                    validateField('amount');
                                                    setFieldValue('amount', '');
                                                    setFieldError('amount', '');
                                                }}
                                                error={selected_from.error}
                                            />
                                        </MobileWrapper>
                                        <DesktopWrapper>
                                            <Dropdown
                                                id='transfer_to'
                                                className='cashier__drop-down account-transfer__drop-down'
                                                classNameDisplay='cashier__drop-down-display'
                                                classNameDisplaySpan='cashier__drop-down-display-span'
                                                classNameItems='cashier__drop-down-items'
                                                classNameLabel='cashier__drop-down-label'
                                                is_large
                                                label={localize('To')}
                                                list={to_accounts}
                                                list_height='404'
                                                name='transfer_to'
                                                value={selected_to.value}
                                                onChange={onChangeTransferTo}
                                                hint={transfer_to_hint}
                                                error={selected_to.error}
                                            />
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <SelectNative
                                                placeholder={localize('Please select')}
                                                className='account-transfer__transfer-to'
                                                classNameDisplay='cashier__drop-down-display'
                                                label={localize('To')}
                                                name='transfer_to'
                                                value={selected_to.value}
                                                list_items={to_accounts}
                                                onChange={onChangeTransferTo}
                                                hint={transfer_to_hint}
                                                error={selected_to.error}
                                            />
                                        </MobileWrapper>
                                    </div>
                                    <Field name='amount' validate={validateAmount}>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                onChange={e => {
                                                    setErrorMessage('');
                                                    handleChange(e);
                                                }}
                                                className='cashier__input dc-input--no-placeholder account-transfer__input'
                                                type='text'
                                                label={localize('Amount')}
                                                error={touched.amount && errors.amount}
                                                required
                                                leading_icon={
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
                                                    transfer_limit.max && (
                                                        <Localize
                                                            i18n_default_text='Transfer limits: <0 /> - <1 />'
                                                            components={[
                                                                <Money
                                                                    key={0}
                                                                    amount={transfer_limit.min}
                                                                    currency={selected_from.currency}
                                                                />,
                                                                <Money
                                                                    key={1}
                                                                    amount={transfer_limit.max}
                                                                    currency={selected_from.currency}
                                                                />,
                                                            ]}
                                                        />
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                    <div className='cashier__form-submit cashier__form-submit--align-end account-transfer__form-submit'>
                                        {error.message && <FormError error_message={error.message} />}
                                        <Button
                                            className='cashier__form-submit-button'
                                            type='submit'
                                            is_disabled={
                                                !isValid ||
                                                isSubmitting ||
                                                !+remaining_transfers ||
                                                !!selected_from.error ||
                                                !!selected_to.error
                                            }
                                            primary
                                            large
                                        >
                                            <Localize i18n_default_text='Transfer' />
                                        </Button>
                                    </div>
                                    <MobileWrapper>
                                        <AccountTransferNote
                                            mt5_total_transfers={mt5_total_transfers}
                                            internal_total_transfers={internal_total_transfers}
                                            transfer_fee={transfer_fee}
                                            currency={selected_from.currency}
                                            minimum_fee={minimum_fee}
                                        />
                                    </MobileWrapper>
                                </Form>
                            )}
                        </React.Fragment>
                    )}
                </Formik>
            </React.Fragment>
        </div>
    );
};

AccountTransferForm.propTypes = {
    account_limits: PropTypes.object,
    accounts_list: PropTypes.array,
    error: PropTypes.object,
    minimum_fee: PropTypes.string,
    onChangeTransferFrom: PropTypes.func,
    onChangeTransferTo: PropTypes.func,
    onMount: PropTypes.func,
    requestTransferBetweenAccounts: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
    setErrorMessage: PropTypes.func,
    setSideNotes: PropTypes.func,
    transfer_fee: PropTypes.number,
    transfer_limit: PropTypes.object,
};

export default connect(({ client, modules }) => ({
    account_limits: client.account_limits,
    onMount: client.getLimits,
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    minimum_fee: modules.cashier.config.account_transfer.minimum_fee,
    onChangeTransferFrom: modules.cashier.onChangeTransferFrom,
    onChangeTransferTo: modules.cashier.onChangeTransferTo,
    requestTransferBetweenAccounts: modules.cashier.requestTransferBetweenAccounts,
    selected_from: modules.cashier.config.account_transfer.selected_from,
    selected_to: modules.cashier.config.account_transfer.selected_to,
    setErrorMessage: modules.cashier.setErrorMessage,
    transfer_fee: modules.cashier.config.account_transfer.transfer_fee,
    transfer_limit: modules.cashier.config.account_transfer.transfer_limit,
}))(AccountTransferForm);
