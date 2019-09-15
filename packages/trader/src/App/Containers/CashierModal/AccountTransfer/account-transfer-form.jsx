import classNames       from 'classnames';
import PropTypes        from 'prop-types';
import React            from 'react';
import {
    Button,
    Dropdown,
    Input }             from 'deriv-components';
import {
    Field,
    Formik,
    Form }              from 'formik';
import Localize         from 'App/Components/Elements/localize.jsx';
import Money            from 'App/Components/Elements/money.jsx';
import { website_name } from 'App/Constants/app-config';
import { localize }     from 'App/i18n';
import Icon             from 'Assets/icon.jsx';
import { connect }      from 'Stores/connect';
import Loading          from '../../../../templates/_common/components/loading.jsx';

class AccountTransferForm extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        const selected_transfer_from = (this.props.accounts_list
            .find(account => account.is_selected) || {}).value;
        const accounts = [];
        const mt_accounts = [];
        this.props.accounts_list.forEach((account, idx) => {
            (account.is_mt ? mt_accounts : accounts).push({
                text: (
                    <React.Fragment key={idx}>
                        <Icon icon='IconAccountsCurrency' type={account.mt5_currency || account.currency.toLowerCase()} />
                        <span className='account-transfer__currency'>{account.text}</span>
                        <span className='account-transfer__balance'>(<Money amount={account.balance} currency={account.currency} />)</span>
                    </React.Fragment>
                ),
                value: account.value,
            });
        });
        const all_accounts = {
            [localize('Deriv accounts')]: accounts,
            [localize('DMT5 accounts')] : mt_accounts,
        };
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='cashier__loader' />
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
                                    // validate={this.validateWithdrawalPassthrough}
                                    // onSubmit={this.onWithdrawalPassthrough}
                                >
                                    {
                                        ({ errors, isSubmitting, isValid, touched }) => (
                                            <Form>
                                                <Dropdown
                                                    id='transfer_from'
                                                    className='cashier__drop-down account-transfer__drop-down'
                                                    classNameDisplay='cashier__drop-down-display'
                                                    classNameDisplaySpan='cashier__drop-down-display-span account-transfer__drop-down-display-span'
                                                    classNameItems='cashier__drop-down-items'
                                                    classNameLabel='cashier__drop-down-label'
                                                    list={all_accounts}
                                                    name='payment_agents'
                                                    value={selected_transfer_from}
                                                    onChange={this.props.onChangeTransferFrom}
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
                                                            leading_icon={<span className={classNames('symbols', `symbols--${this.props.currency.toLowerCase()}`)} />}
                                                            autoComplete='off'
                                                            maxLength='30'
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
                                                                        currency    : this.props.currency,
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
        );
    }
}

AccountTransferForm.propTypes = {
    accounts_list         : PropTypes.array,
    currency              : PropTypes.string,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    minimum_fee           : PropTypes.string,
    onChangeTransferFrom  : PropTypes.func,
    onMount               : PropTypes.func,
    transfer_fee          : PropTypes.number,
};

export default connect(
    ({ client, modules }) => ({
        currency              : client.currency,
        accounts_list         : modules.cashier.config.account_transfer.accounts_list,
        error                 : modules.cashier.config.account_transfer.error,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.account_transfer.is_transfer_successful,
        minimum_fee           : modules.cashier.config.account_transfer.minimum_fee,
        onChangeTransferFrom  : modules.cashier.onChangeTransferFrom,
        onMount               : modules.cashier.onMountAccountTransfer,
        transfer_fee          : modules.cashier.config.account_transfer.transfer_fee,
    })
)(AccountTransferForm);
