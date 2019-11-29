import PropTypes              from 'prop-types';
import fromEntries            from 'object.fromentries';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import { toMoment }           from 'Utils/Date';
import AddressDetails         from './address-details.jsx';
import CurrencySelector       from './currency-selector.jsx';
import FormProgress           from './form-progress.jsx';
import PersonalDetails        from './personal-details.jsx';
import TermsOfUse             from './terms-of-use.jsx';

class AccountWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished  : undefined,
            step      : 0,
            form_error: '',
            items     : [
                {
                    header: {
                        active_title: localize('Please choose your currency'),
                        title       : localize('Account currency'),
                    },
                    body      : CurrencySelector,
                    form_value: {
                        currency: '',
                    },
                },
                {
                    header: {
                        active_title: localize('Complete your personal details'),
                        title       : localize('Personal details'),
                    },
                    body      : PersonalDetails,
                    form_value: {
                        first_name   : '',
                        last_name    : '',
                        date_of_birth: '',
                        phone        : '',
                    },
                },
                {
                    header: {
                        active_title: localize('Complete your address details'),
                        title       : localize('Address details'),
                    },
                    body      : AddressDetails,
                    form_value: {
                        address_line_1  : '',
                        address_line_2  : '',
                        address_city    : '',
                        address_state   : '',
                        address_postcode: '',
                    },
                },
                {
                    header: {
                        active_title: localize('Terms of use'),
                        title       : localize('Terms of use'),
                    },
                    body      : TermsOfUse,
                    form_value: {
                        agreed_tos: false,
                        agreed_tnc: false,
                    },
                },
            ],
        };
    }

    get form_values() {
        return this.state.items.map(item => item.form_value)
            .reduce((obj, item) => {
                const values = fromEntries(new Map(Object.entries(item)));
                if (values.date_of_birth) {
                    values.date_of_birth = toMoment(values.date_of_birth).format('YYYY-MM-DD');
                }

                return {
                    ...obj,
                    ...values,
                };
            });
    }

    get state_index() {
        return this.state.step;
    }

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    getCurrent = (key) => {
        return key ? this.state.items[this.state_index][key] : this.state.items[this.state_index];
    };

    getFinishedComponent = () => {
        return this.state.finished;
    };

    nextStep = (setSubmitting) => {
        this.clearError();
        // Check if account wizard is not finished
        if (this.hasMoreSteps()) {
            this.goNext();
        } else {
            this.props.onLoading();
            this.createRealAccount(setSubmitting);
        }
    };

    prevStep = () => {
        this.setState({
            step      : this.state.step - 1,
            form_error: '',
        });
    };

    submitForm = () => this.props.realAccountSignup(this.form_values);

    setAccountCurrency = () => this.props.setAccountCurrency(this.form_values.currency);

    updateValue = (index, value, setSubmitting) => {
        this.saveFormData(index, value);
        this.nextStep(setSubmitting);
    };

    saveFormData = (index, value) => {
        const cloned_items             = Object.assign([], this.state.items);
        cloned_items[index].form_value = value;

        this.setState({
            items: cloned_items,
        });
    };

    createRealAccount(setSubmitting) {
        if (this.props.has_real_account
            && !this.props.has_currency
        ) {
            this.setAccountCurrency()
                .then((response) => {
                    setSubmitting(false);
                    this.props.onSuccessAddCurrency(
                        response.echo_req.set_account_currency.toLowerCase()
                    );
                })
                .catch(error_message => {
                    this.setState({
                        form_error: error_message,
                    }, () => setSubmitting(false));
                });
        } else {
            this.submitForm()
                .then((response) => {
                    setSubmitting(false);
                    this.props.onSuccessAddCurrency(
                        response.new_account_real.currency.toLowerCase()
                    );
                })
                .catch(error_message => {
                    this.props.onError(error_message);
                });
        }
    }

    goNext() {
        this.setState({
            step: this.state.step + 1,
        });
    }

    hasMoreSteps() {
        if (!this.props.has_currency && this.props.has_real_account) {
            return false;
        }
        return this.state.step + 1 < this.state.items.length;
    }

    render() {
        if (!this.state.finished) {
            const BodyComponent = this.getCurrent('body');
            return (
                <div className='account-wizard'>
                    {!this.props.has_real_account &&
                    <FormProgress
                        steps={this.state.items}
                        current_step={this.state.step}
                    />
                    }
                    {this.props.has_real_account &&
                    <div className='account-wizard__set-currency'>
                        {!this.props.has_currency &&
                        <p>
                            <Localize
                                i18n_default_text='You have an account that do not have currency assigned. Please choose a currency to trade with this account.'
                            />
                        </p>
                        }
                        <h2>
                            <Localize
                                i18n_default_text='Please choose your currency'
                            />
                        </h2>
                    </div>
                    }
                    <div
                        className='account-wizard__body'
                    >
                        <BodyComponent
                            value={this.getCurrent('form_value')}
                            index={this.state_index}
                            onSubmit={this.updateValue}
                            onCancel={this.prevStep}
                            onSave={this.saveFormData}
                            has_currency={this.props.has_currency}
                            form_error={this.state.form_error}
                        />
                    </div>
                </div>
            );
        }

        const FinishedModalItem = this.getFinishedComponent();
        return (
            <FinishedModalItem />
        );
    }
}

AccountWizard.propTypes = {
    onError             : PropTypes.func,
    onLoading           : PropTypes.func,
    onSuccessAddCurrency: PropTypes.func,
};

export default connect(({ client }) => ({
    realAccountSignup : client.realAccountSignup,
    has_real_account  : client.has_active_real_account,
    has_currency      : !!client.currency,
    setAccountCurrency: client.setAccountCurrency,
}))(AccountWizard);
