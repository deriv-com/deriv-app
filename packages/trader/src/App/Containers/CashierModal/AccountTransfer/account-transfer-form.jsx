import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Input }                 from 'deriv-components';
import {
    Field,
    Formik,
    Form }                  from 'formik';
import Localize             from 'App/Components/Elements/localize.jsx';
import { localize }         from 'App/i18n';
import Icon                 from 'Assets/icon.jsx';
import { connect }          from 'Stores/connect';
import Loading              from '../../../../templates/_common/components/loading.jsx';

class AccountTransferForm extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        return (
            <React.Fragment>
                {this.props.is_loading ?
                    <Loading className='account-transfer__loader' />
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
    currency              : PropTypes.string,
    is_loading            : PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    onMount               : PropTypes.func,
};

export default connect(
    ({ client, modules }) => ({
        currency              : client.currency,
        error                 : modules.cashier.config.account_transfer.error,
        is_loading            : modules.cashier.is_loading,
        is_transfer_successful: modules.cashier.config.account_transfer.is_transfer_successful,
        onMount               : modules.cashier.onMountAccountTransfer,
    })
)(AccountTransferForm);
