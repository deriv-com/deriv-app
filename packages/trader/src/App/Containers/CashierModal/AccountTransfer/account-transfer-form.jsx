import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Dropdown,
    Input }                 from 'deriv-components';
import {
    Field,
    Formik,
    Form }                  from 'formik';
import { getDecimalPlaces } from '_common/base/currency_base';
import Localize             from 'App/Components/Elements/localize.jsx';
import Money                from 'App/Components/Elements/money.jsx';
import { website_name }     from 'App/Constants/app-config';
import { localize }         from 'App/i18n';
import Icon                 from 'Assets/icon.jsx';
import { connect }          from 'Stores/connect';
import {
    getPreBuildDVRs,
    validNumber }           from 'Utils/Validator/declarative-validation-rules';
import Error                from '../error.jsx';
import Loading              from '../../../../templates/_common/components/loading.jsx';

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

const AccountOption = ({
    idx,
    account,
}) => (
    <React.Fragment key={idx}>
        <Icon
            icon='IconAccountsCurrency'
            type={account.mt_icon ? account.mt_icon.value : account.currency.toLowerCase()}
            height={16}
            width={16}
            vb_height={account.mt_icon ? account.mt_icon.vb_height : undefined}
            vb_width={account.mt_icon ? account.mt_icon.vb_width : undefined}
        />
        <span className='account-transfer__currency'>{account.text}</span>
        <span className='account-transfer__balance'>(<Money amount={account.balance} currency={account.currency} />)</span>
    </React.Fragment>
);

class AccountTransferForm extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    validateTransferPassthrough = (values) => (
        validateTransfer(values, {
            balance       : this.props.balance,
            currency      : this.props.selected_from.currency,
            transfer_limit: this.props.transfer_limit,
        })
    );

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
            [localize('DMT5 accounts')] : mt_accounts_from,
        };

        const to_accounts = {
            [localize('Deriv accounts')]: accounts_to,
            [localize('DMT5 accounts')] : mt_accounts_to,
        };

        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='cashier__loader' />
                    :
                    <React.Fragment>
                        {/* for errors with CTA hide the form and show the error,
                         for others show them at the bottom of the form next to submit button */}
                        {this.props.error.button_text ?
                            <Error error={this.props.error} />
                            :
                            <div className='cashier__wrapper--align-left'>
                                {this.props.is_transfer_successful ?
                                    <div />
                                    :
                                    <React.Fragment>
                                        <Formik
                                            initialValues={{
                                                amount: '',
                                            }}
                                            validate={this.validateTransferPassthrough}
                                            // onSubmit={this.onWithdrawalPassthrough}
                                        >
                                            {
                                                ({ errors, isSubmitting, isValid, touched }) => (
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
                                                                    type='number'
                                                                    label={localize('Amount')}
                                                                    error={ touched.amount && errors.amount }
                                                                    required
                                                                    leading_icon={<span className={classNames('symbols', `symbols--${this.props.selected_from.currency.toLowerCase()}`)} />}
                                                                    autoComplete='off'
                                                                    maxLength='30'
                                                                    hint={
                                                                        this.props.transfer_limit.max &&
                                                                        <Localize
                                                                            i18n_default_text='Transfer limit: <0 />'
                                                                            components={[
                                                                                <Money
                                                                                    key={0}
                                                                                    amount={this.props.transfer_limit.max} // eslint-disable-line max-len
                                                                                    currency={this.props.selected_from.currency} // eslint-disable-line max-len
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
                                                                                currency    : this.props.selected_from.currency, // eslint-disable-line max-len
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
                                                )
                                            }
                                        </Formik>
                                    </React.Fragment>
                                }
                            </div>
                        }
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

AccountTransferForm.propTypes = {
    accounts_list         : PropTypes.array,
    balance               : PropTypes.string,
    error                 : PropTypes.object,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    minimum_fee           : PropTypes.string,
    onChangeTransferFrom  : PropTypes.func,
    onChangeTransferTo    : PropTypes.func,
    onMount               : PropTypes.func,
    selected_from         : PropTypes.object,
    selected_to           : PropTypes.object,
    transfer_fee          : PropTypes.number,
    transfer_limit        : PropTypes.object,
};

export default connect(
    ({ client, modules }) => ({
        balance               : client.balance,
        accounts_list         : modules.cashier.config.account_transfer.accounts_list,
        error                 : modules.cashier.config.account_transfer.error,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.account_transfer.is_transfer_successful,
        minimum_fee           : modules.cashier.config.account_transfer.minimum_fee,
        onChangeTransferFrom  : modules.cashier.onChangeTransferFrom,
        onChangeTransferTo    : modules.cashier.onChangeTransferTo,
        onMount               : modules.cashier.onMountAccountTransfer,
        selected_from         : modules.cashier.config.account_transfer.selected_from,
        selected_to           : modules.cashier.config.account_transfer.selected_to,
        transfer_fee          : modules.cashier.config.account_transfer.transfer_fee,
        transfer_limit        : modules.cashier.config.account_transfer.transfer_limit,
    })
)(AccountTransferForm);
