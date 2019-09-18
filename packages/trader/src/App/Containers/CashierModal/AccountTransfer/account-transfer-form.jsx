import classNames             from 'classnames';
import PropTypes              from 'prop-types';
import React                  from 'react';
import {
    Button,
    Dropdown,
    Input }                   from 'deriv-components';
import {
    Field,
    Formik,
    Form }                    from 'formik';
import { getDecimalPlaces }   from '_common/base/currency_base';
import Localize               from 'App/Components/Elements/localize.jsx';
import Money                  from 'App/Components/Elements/money.jsx';
import { website_name }       from 'App/Constants/app-config';
import { localize }           from 'App/i18n';
import Icon                   from 'Assets/icon.jsx';
import { connect }            from 'Stores/connect';
import {
    getPreBuildDVRs,
    validNumber }             from 'Utils/Validator/declarative-validation-rules';
import Loading                from '../../../../templates/_common/components/loading.jsx';

const validateTransfer = (values, { balance, currency, transfer_limit }) => {
    const errors = {};

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!validNumber(values.amount, { type: 'float', decimals: getDecimalPlaces(currency), min: transfer_limit.min, max: transfer_limit.max })) {
        errors.amount = getPreBuildDVRs().number.message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

const AccountOption = ({ account, idx }) => (
    <React.Fragment key={idx}>
        {(account.currency || account.mt_icon) &&
            <Icon
                icon='IconAccountsCurrency'
                type={account.mt_icon || account.currency.toLowerCase()}
                height={16}
                width={16}
            />
        }
        <span className='account-transfer__currency'>{account.text}</span>
        <span className='account-transfer__balance'>(<Money amount={account.balance} currency={account.currency} />)</span>
    </React.Fragment>
);

class AccountTransferForm extends React.Component {
    validateTransferPassthrough = (values) => (
        validateTransfer(values, {
            balance       : this.props.selected_from.balance,
            currency      : this.props.selected_from.currency,
            transfer_limit: this.props.transfer_limit,
        })
    );

    onTransferPassthrough = async (values, actions) => {
        const transfer_between_accounts = await this.props.requestTransferBetweenAccounts({
            amount: values.amount,
        });
        if (transfer_between_accounts.error) {
            actions.setSubmitting(false);
        }
    };

    render() {
        const accounts_from    = [];
        const mt_accounts_from = [];
        const accounts_to      = [];
        const mt_accounts_to   = [];

        this.props.accounts_list.forEach((account, idx) => {
            const text  = <AccountOption idx={idx} account={account} />;
            const value = account.value;
            (account.is_mt ? mt_accounts_from : accounts_from).push({
                text,
                value,
            });
            const is_selected_from    = account.value === this.props.selected_from.value;
            const is_selected_from_mt = this.props.selected_from.is_mt && account.is_mt;
            // account from and to cannot be the same
            // cannot transfer to MT account from MT
            const is_disabled = is_selected_from_mt || is_selected_from;
            (account.is_mt ? mt_accounts_to : accounts_to).push({
                text,
                value,
                disabled: is_disabled,
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
                    <Formik
                        initialValues={{
                            amount: '',
                        }}
                        validate={this.validateTransferPassthrough}
                        onSubmit={this.onTransferPassthrough}
                    >
                        {
                            ({ errors, isSubmitting, isValid, touched }) => (
                                <React.Fragment>
                                    {isSubmitting ?
                                        <div className='cashier__loader-wrapper'>
                                            <Loading className='cashier__loader' />
                                        </div>
                                        :
                                        <Form>
                                            <Dropdown
                                                id='transfer_from'
                                                className='cashier__drop-down account-transfer__drop-down'
                                                classNameDisplay='cashier__drop-down-display'
                                                classNameDisplaySpan='cashier__drop-down-display-span'
                                                classNameItems='cashier__drop-down-items'
                                                classNameLabel='cashier__drop-down-label'
                                                list={from_accounts}
                                                name='transfer_from'
                                                value={this.props.selected_from.value}
                                                onChange={this.props.onChangeTransferFrom}
                                            />
                                            <Icon className='cashier__transferred-icon account-transfer__transfer-icon' icon='IconBack' />
                                            <Dropdown
                                                id='transfer_to'
                                                className='cashier__drop-down account-transfer__drop-down'
                                                classNameDisplay='cashier__drop-down-display'
                                                classNameDisplaySpan='cashier__drop-down-display-span'
                                                classNameItems='cashier__drop-down-items'
                                                classNameLabel='cashier__drop-down-label'
                                                list={to_accounts}
                                                name='transfer_to'
                                                value={this.props.selected_to.value}
                                                onChange={this.props.onChangeTransferTo}
                                            />
                                            <Field name='amount'>
                                                {({ field }) => (
                                                    <Input
                                                        { ...field }
                                                        className='cashier__input-long dc-input--no-placeholder'
                                                        type='text'
                                                        label={localize('Amount')}
                                                        error={ touched.amount && errors.amount }
                                                        required
                                                        leading_icon={
                                                            this.props.selected_from.currency ?
                                                                <span className={classNames('symbols', `symbols--${this.props.selected_from.currency.toLowerCase()}`)} />
                                                                : undefined
                                                        }
                                                        autoComplete='off'
                                                        maxLength='30'
                                                        hint={
                                                            this.props.transfer_limit.max &&
                                                            <Localize
                                                                i18n_default_text='Transfer limit: <0 />'
                                                                components={[
                                                                    <Money
                                                                        key={0}
                                                                        amount={this.props.transfer_limit.max}
                                                                        currency={this.props.selected_from.currency}
                                                                    />,
                                                                ]}
                                                            />
                                                        }
                                                    />
                                                )}
                                            </Field>
                                            <div>
                                                <div className='account-transfer__notes'>
                                                    <div className='account-transfer__bullet-wrapper'>
                                                        <div className='account-transfer__bullet' />
                                                        <span><Localize i18n_default_text='Transfer limits may vary depending on changes in exchange rates.' /></span>
                                                    </div>
                                                    <div className='account-transfer__bullet-wrapper'>
                                                        <div className='account-transfer__bullet' />
                                                        <span>
                                                            <Localize
                                                                i18n_default_text='Transfers are subject to a {{transfer_fee}}% transfer fee or {{currency}} {{minimum_fee}}, whichever is higher.'
                                                                values={{
                                                                    transfer_fee: this.props.transfer_fee,
                                                                    currency    : this.props.selected_from.currency,
                                                                    minimum_fee : this.props.minimum_fee,
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                    <div className='account-transfer__bullet-wrapper'>
                                                        <div className='account-transfer__bullet' />
                                                        <span><Localize i18n_default_text='Transfers are possible only between your fiat and cryptocurrency accounts (and vice versa), or between your {{website_name}} account and your {{website_name}} MT5 (DMT5) account (or vice versa).' values={{ website_name }} /></span>
                                                    </div>
                                                    <div className='account-transfer__bullet-wrapper'>
                                                        <div className='account-transfer__bullet' />
                                                        <span><Localize i18n_default_text='Transfers may be unavailable at times when the market is closed (weekends or holidays), periods of high volatility or because of technical issues.' /></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='cashier__form-submit'>
                                                {this.props.error.message &&
                                                <React.Fragment>
                                                    <Icon icon='IconEmergency' className='cashier__form-error-icon' />
                                                    <Icon icon='IconError' className='cashier__form-error-small-icon' />
                                                    <p className='cashier__form-error'>
                                                        {this.props.error.message}
                                                    </p>
                                                </React.Fragment>
                                                }
                                                <Button
                                                    className='cashier__form-submit-button btn--primary btn--primary--orange'
                                                    type='submit'
                                                    is_disabled={!isValid || isSubmitting}
                                                >
                                                    <Localize i18n_default_text='Transfer' />
                                                </Button>
                                            </div>
                                        </Form>
                                    }
                                </React.Fragment>
                            )
                        }
                    </Formik>
                </React.Fragment>
            </div>
        );
    }
}

AccountTransferForm.propTypes = {
    accounts_list                 : PropTypes.array,
    error                         : PropTypes.object,
    minimum_fee                   : PropTypes.string,
    onChangeTransferFrom          : PropTypes.func,
    onChangeTransferTo            : PropTypes.func,
    requestTransferBetweenAccounts: PropTypes.func,
    selected_from                 : PropTypes.object,
    selected_to                   : PropTypes.object,
    transfer_fee                  : PropTypes.number,
    transfer_limit                : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        accounts_list                 : modules.cashier.config.account_transfer.accounts_list,
        minimum_fee                   : modules.cashier.config.account_transfer.minimum_fee,
        onChangeTransferFrom          : modules.cashier.onChangeTransferFrom,
        onChangeTransferTo            : modules.cashier.onChangeTransferTo,
        requestTransferBetweenAccounts: modules.cashier.requestTransferBetweenAccounts,
        selected_from                 : modules.cashier.config.account_transfer.selected_from,
        selected_to                   : modules.cashier.config.account_transfer.selected_to,
        transfer_fee                  : modules.cashier.config.account_transfer.transfer_fee,
        transfer_limit                : modules.cashier.config.account_transfer.transfer_limit,
    })
)(AccountTransferForm);
