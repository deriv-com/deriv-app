import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Icon, Input, Money, DesktopWrapper, MobileWrapper, Collapsible } from '@deriv/components';
import { Field, Formik, Form } from 'formik';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { isMobile } from '@deriv/shared/utils/screen';
import { website_name } from 'App/Constants/app-config';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getPreBuildDVRs, validNumber } from 'Utils/Validator/declarative-validation-rules';
import Loading from '../../../../templates/_common/components/loading.jsx';

const AccountOption = ({ account, idx }) => (
    <React.Fragment key={idx}>
        {(account.currency || account.mt_icon) && (
            <Icon
                icon={account.mt_icon ? `IcMt5-${account.mt_icon}` : `IcCurrency-${account.currency.toLowerCase()}`}
                className='account-transfer__currency-icon'
            />
        )}
        <span className='account-transfer__currency'>{account.text}</span>
        <span className='account-transfer__balance'>
            (<Money amount={account.balance} currency={account.currency} />)
        </span>
    </React.Fragment>
);

const AccountTransferNote = ({ currency, transfer_fee, minimum_fee }) => {
    const note = (
        <div className='account-transfer__notes'>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize i18n_default_text='Transfer limits may vary depending on changes in exchange rates.' />
                </span>
            </div>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize
                        i18n_default_text='Transfers are subject to a {{transfer_fee}}% transfer fee or {{currency}} {{minimum_fee}}, whichever is higher.'
                        values={{
                            transfer_fee,
                            currency,
                            minimum_fee,
                        }}
                    />
                </span>
            </div>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize
                        i18n_default_text='Transfers are possible only between your fiat and cryptocurrency accounts (and vice versa), or between your {{website_name}} account and your {{website_name}} MT5 (DMT5) account (or vice versa).'
                        values={{ website_name }}
                    />
                </span>
            </div>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize i18n_default_text='Transfers may be unavailable at times such as when the market is closed (weekends or holidays), periods of high volatility, or when there are technical issues.' />
                </span>
            </div>
        </div>
    );

    return (
        <>
            <DesktopWrapper>{note}</DesktopWrapper>
            <MobileWrapper>
                <Collapsible is_collapsed position='top' title={localize('Notes')}>
                    <div collapsible='true'>{note}</div>
                </Collapsible>
            </MobileWrapper>
        </>
    );
};

class AccountTransferForm extends React.Component {
    validateAmount = amount => {
        let error;

        if (!amount) {
            error = localize('This field is required.');
        } else if (
            !validNumber(amount, {
                type: 'float',
                decimals: CurrencyUtils.getDecimalPlaces(this.props.selected_from.currency),
                min: this.props.transfer_limit.min,
                max: this.props.transfer_limit.max,
            })
        ) {
            error = getPreBuildDVRs().number.message;
        } else if (+this.props.selected_from.balance < +amount) {
            error = localize('Insufficient balance.');
        }

        return error;
    };

    onTransferPassthrough = async (values, actions) => {
        const transfer_between_accounts = await this.props.requestTransferBetweenAccounts({
            amount: values.amount,
        });
        if (transfer_between_accounts.error) {
            actions.setSubmitting(false);
        }
    };

    render() {
        const accounts_from = [];
        const mt_accounts_from = [];
        const accounts_to = [];
        const mt_accounts_to = [];

        this.props.accounts_list.forEach((account, idx) => {
            const text = <AccountOption idx={idx} account={account} />;
            const value = account.value;
            (account.is_mt ? mt_accounts_from : accounts_from).push({
                text,
                value,
                nativepicker_text: `${account.text} (${account.currency} ${account.balance})`,
            });
            const is_selected_from = account.value === this.props.selected_from.value;
            const is_selected_from_mt = this.props.selected_from.is_mt && account.is_mt;
            const is_selected_from_crypto = this.props.selected_from.is_crypto && account.is_crypto;
            // account from and to cannot be the same
            // cannot transfer to MT account from MT
            // cannot transfer to crypto account from crypto
            const is_disabled = is_selected_from_mt || is_selected_from || is_selected_from_crypto;
            (account.is_mt ? mt_accounts_to : accounts_to).push({
                text,
                value,
                disabled: is_disabled,
                nativepicker_text: `${account.text} (${account.currency} ${account.balance})`,
            });
        });

        const from_accounts = {
            [localize('Deriv accounts')]: accounts_from,
            ...(mt_accounts_from.length && { [localize('DMT5 accounts')]: mt_accounts_from }),
        };

        const to_accounts = {
            [localize('Deriv accounts')]: accounts_to,
            ...(mt_accounts_to.length && { [localize('DMT5 accounts')]: mt_accounts_to }),
        };

        return (
            <div className='cashier__wrapper--align-left'>
                <React.Fragment>
                    <MobileWrapper>
                        <AccountTransferNote
                            transfer_fee={this.props.transfer_fee}
                            currency={this.props.selected_from.currency}
                            minimum_fee={this.props.minimum_fee}
                        />
                        <p className='cashier__header'>{localize('Transfer between your accounts in Deriv')}</p>
                    </MobileWrapper>
                    <Formik
                        initialValues={{
                            amount: '',
                        }}
                        onSubmit={this.onTransferPassthrough}
                    >
                        {({ errors, isSubmitting, isValid, touched, validateField, handleChange }) => (
                            <React.Fragment>
                                {isSubmitting ? (
                                    <div className='cashier__loader-wrapper'>
                                        <Loading className='cashier__loader' />
                                    </div>
                                ) : (
                                    <Form>
                                        <Dropdown
                                            id='transfer_from'
                                            className='cashier__drop-down account-transfer__drop-down'
                                            classNameDisplay='cashier__drop-down-display'
                                            classNameDisplaySpan='cashier__drop-down-display-span'
                                            classNameItems='cashier__drop-down-items'
                                            classNameLabel='cashier__drop-down-label'
                                            label={localize('From')}
                                            list={from_accounts}
                                            name='transfer_from'
                                            value={this.props.selected_from.value}
                                            onChange={e => {
                                                this.props.onChangeTransferFrom(e);
                                                handleChange(e);
                                                validateField('amount');
                                            }}
                                            is_nativepicker={isMobile()}
                                            is_nativepicker_visible={
                                                isMobile() ? this.props.is_nativepicker_visible : undefined
                                            }
                                        />
                                        <DesktopWrapper>
                                            <Icon
                                                className='cashier__transferred-icon account-transfer__transfer-icon'
                                                icon='IcArrowLeftBold'
                                            />
                                        </DesktopWrapper>
                                        <Dropdown
                                            id='transfer_to'
                                            className='cashier__drop-down account-transfer__drop-down'
                                            classNameDisplay='cashier__drop-down-display'
                                            classNameDisplaySpan='cashier__drop-down-display-span'
                                            classNameItems='cashier__drop-down-items'
                                            classNameLabel='cashier__drop-down-label'
                                            label={localize('To')}
                                            list={to_accounts}
                                            name='transfer_to'
                                            value={this.props.selected_to.value}
                                            onChange={this.props.onChangeTransferTo}
                                            is_nativepicker={isMobile()}
                                            is_nativepicker_visible={
                                                isMobile() ? this.props.is_nativepicker_visible : undefined
                                            }
                                        />
                                        <Field name='amount' validate={this.validateAmount}>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    onChange={e => {
                                                        this.props.setErrorMessage('');
                                                        handleChange(e);
                                                    }}
                                                    className='cashier__input cashier__input--long dc-input--no-placeholder'
                                                    type='text'
                                                    label={localize('Amount')}
                                                    error={touched.amount && errors.amount}
                                                    required
                                                    leading_icon={
                                                        this.props.selected_from.currency ? (
                                                            <span
                                                                className={classNames(
                                                                    'symbols',
                                                                    `symbols--${this.props.selected_from.currency.toLowerCase()}`
                                                                )}
                                                            />
                                                        ) : (
                                                            undefined
                                                        )
                                                    }
                                                    autoComplete='off'
                                                    maxLength='30'
                                                    hint={
                                                        this.props.transfer_limit.min &&
                                                        this.props.transfer_limit.max && (
                                                            <Localize
                                                                i18n_default_text='Transfer limits: <0 />-<1 />'
                                                                components={[
                                                                    <Money
                                                                        key={0}
                                                                        amount={this.props.transfer_limit.min}
                                                                        currency={this.props.selected_from.currency}
                                                                    />,
                                                                    <Money
                                                                        key={1}
                                                                        amount={this.props.transfer_limit.max}
                                                                        currency={this.props.selected_from.currency}
                                                                    />,
                                                                ]}
                                                            />
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <DesktopWrapper>
                                            <AccountTransferNote
                                                transfer_fee={this.props.transfer_fee}
                                                currency={this.props.selected_from.currency}
                                                minimum_fee={this.props.minimum_fee}
                                            />
                                            <div className='cashier__form-submit'>
                                                {this.props.error.message && (
                                                    <React.Fragment>
                                                        <Icon
                                                            icon='IcAlertDanger'
                                                            className='cashier__form-error-icon'
                                                            size={128}
                                                        />
                                                        <Icon
                                                            icon='IcAlertDanger'
                                                            className='cashier__form-error-small-icon'
                                                        />
                                                        <p className='cashier__form-error'>
                                                            {this.props.error.message}
                                                        </p>
                                                    </React.Fragment>
                                                )}
                                                <Button
                                                    className='cashier__form-submit-button'
                                                    type='submit'
                                                    is_disabled={!isValid || isSubmitting}
                                                    primary
                                                    large
                                                >
                                                    <Localize i18n_default_text='Transfer' />
                                                </Button>
                                            </div>
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <div className='cashier__form-submit'>
                                                {this.props.error.message && (
                                                    <div className='cashier__form-error-container'>
                                                        <Icon
                                                            icon='IcAlertDanger'
                                                            className='cashier__form-error-small-icon'
                                                        />
                                                        <p className='cashier__form-error'>
                                                            {this.props.error.message}
                                                        </p>
                                                    </div>
                                                )}
                                                <Button
                                                    className='cashier__form-submit-button'
                                                    type='submit'
                                                    is_disabled={!isValid || isSubmitting}
                                                    primary
                                                    large
                                                >
                                                    <Localize i18n_default_text='Transfer' />
                                                </Button>
                                            </div>
                                        </MobileWrapper>
                                    </Form>
                                )}
                            </React.Fragment>
                        )}
                    </Formik>
                </React.Fragment>
            </div>
        );
    }
}

AccountTransferForm.propTypes = {
    accounts_list: PropTypes.array,
    error: PropTypes.object,
    minimum_fee: PropTypes.string,
    onChangeTransferFrom: PropTypes.func,
    onChangeTransferTo: PropTypes.func,
    requestTransferBetweenAccounts: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
    setErrorMessage: PropTypes.func,
    transfer_fee: PropTypes.number,
    transfer_limit: PropTypes.object,
};

export default connect(({ modules, ui }) => ({
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
    is_nativepicker_visible: ui.is_nativepicker_visible,
}))(AccountTransferForm);
