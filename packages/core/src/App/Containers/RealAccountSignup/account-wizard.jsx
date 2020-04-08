import PropTypes from 'prop-types';
import fromEntries from 'object.fromentries';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Div100vhContainer } from '@deriv/components';
import { isDesktop } from '@deriv/shared/utils/screen';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { toMoment } from 'Utils/Date';
import AddressDetails from './address-details.jsx';
import CurrencySelector from './currency-selector.jsx';
import FormProgress from './form-progress.jsx';
import PersonalDetails from './personal-details.jsx';
import TermsOfUse from './terms-of-use.jsx';

class AccountWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: undefined,
            step: 0,
            form_error: '',
            items: [
                {
                    header: {
                        active_title: localize('Please choose your currency'),
                        title: localize('Account currency'),
                    },
                    body: CurrencySelector,
                    form_value: {
                        currency: '',
                    },
                },
                {
                    header: {
                        active_title: localize('Complete your personal details'),
                        title: localize('Personal details'),
                    },
                    body: PersonalDetails,
                    form_value: {
                        first_name: '',
                        last_name: '',
                        date_of_birth: '',
                        phone: '',
                    },
                    passthrough: ['residence_list'],
                },
                {
                    header: {
                        active_title: localize('Complete your address details'),
                        title: localize('Address details'),
                    },
                    body: AddressDetails,
                    form_value: {
                        address_line_1: '',
                        address_line_2: '',
                        address_city: '',
                        address_state: '',
                        address_postcode: '',
                    },
                },
                {
                    header: {
                        active_title: isDesktop() ? localize('Terms of use') : null,
                        title: localize('Terms of use'),
                    },
                    body: TermsOfUse,
                    form_value: {
                        agreed_tos: false,
                        agreed_tnc: false,
                    },
                },
            ],
        };
    }

    componentDidMount() {
        this.fetchFromStorage();
        if (!this.residence_list?.length) {
            const items = this.state.items.slice(0);
            this.getCountryCode().then(phone_idd => {
                items[1].form_value.phone = phone_idd || '';
                this.setState(items);
            });
        }
    }

    fetchFromStorage = () => {
        const stored_items = localStorage.getItem('real_account_signup_wizard');
        try {
            const items = JSON.parse(stored_items);
            const cloned = this.state.items.slice(0);
            items.forEach((item, index) => {
                if (typeof item === 'object') {
                    cloned[index].form_value = item;
                }
            });
            this.setState({
                items: cloned,
                step: 1, // Send the user back to personal details.
            });
            localStorage.removeItem('real_account_signup_wizard');
        } catch (e) {
            localStorage.removeItem('real_account_signup_wizard');
        }
    };

    get form_values() {
        return this.state.items
            .map(item => item.form_value)
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

    getCountryCode = async () => {
        await this.props.fetchResidenceList();
        const response = this.props.residence_list.find(item => item.value === this.props.residence);
        if (!response || !response.phone_idd) return '';
        return `+${response.phone_idd}`;
    };

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    getCurrent = key => {
        return key ? this.state.items[this.state_index][key] : this.state.items[this.state_index];
    };

    getFinishedComponent = () => {
        return this.state.finished;
    };

    nextStep = setSubmitting => {
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
            step: this.state.step - 1,
            form_error: '',
        });
    };

    submitForm = () => {
        return this.props.realAccountSignup(this.form_values);
    };

    setAccountCurrency = () => this.props.setAccountCurrency(this.form_values.currency);

    updateValue = (index, value, setSubmitting) => {
        this.saveFormData(index, value);
        this.nextStep(setSubmitting);
    };

    saveFormData = (index, value) => {
        const cloned_items = Object.assign([], this.state.items);
        cloned_items[index].form_value = value;

        this.setState({
            items: cloned_items,
        });
    };

    getPropsForChild = () => {
        const passthrough = this.getCurrent('passthrough');
        if (passthrough && passthrough.length) {
            const props = {};
            passthrough.forEach(item => {
                Object.assign(props, { [item]: this.props[item] });
            });
            return props;
        }
        return {};
    };

    createRealAccount(setSubmitting) {
        if (this.props.has_real_account && !this.props.has_currency) {
            this.setAccountCurrency()
                .then(response => {
                    setSubmitting(false);
                    this.props.onSuccessAddCurrency(response.echo_req.set_account_currency.toLowerCase());
                })
                .catch(error_message => {
                    this.setState(
                        {
                            form_error: error_message,
                        },
                        () => setSubmitting(false)
                    );
                });
        } else {
            this.submitForm()
                .then(response => {
                    setSubmitting(false);
                    this.props.onSuccessAddCurrency(response.new_account_real.currency.toLowerCase());
                })
                .catch(error => {
                    this.props.onError(error, this.state.items);
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
            const passthrough = this.getPropsForChild();
            return (
                <div className='account-wizard'>
                    {!this.props.has_real_account && (
                        <>
                            <DesktopWrapper>
                                <FormProgress steps={this.state.items} current_step={this.state.step} />
                            </DesktopWrapper>
                            <MobileWrapper>
                                <div className='account-wizard__header-steps'>
                                    <h4 className='account-wizard__header-steps-title'>
                                        <Localize
                                            i18n_default_text='Step {{step}}: {{step_title}} ({{step}} of {{steps}})'
                                            values={{
                                                step: this.state.step + 1,
                                                steps: this.state.items.length,
                                                step_title: this.state.items[this.state.step].header.title,
                                            }}
                                        />
                                    </h4>
                                    {this.state.items[this.state.step].header.active_title && (
                                        <h4 className='account-wizard__header-steps-subtitle'>
                                            {this.state.items[this.state.step].header.active_title}
                                        </h4>
                                    )}
                                </div>
                            </MobileWrapper>
                        </>
                    )}
                    <DesktopWrapper>
                        {this.props.has_real_account && (
                            <div className='account-wizard__set-currency'>
                                {!this.props.has_currency && (
                                    <p>
                                        <Localize i18n_default_text='You have an account that do not have currency assigned. Please choose a currency to trade with this account.' />
                                    </p>
                                )}
                                <h2>
                                    <Localize i18n_default_text='Please choose your currency' />
                                </h2>
                            </div>
                        )}
                    </DesktopWrapper>
                    <Div100vhContainer className='account-wizard__body' is_disabled={isDesktop()} height_offset='40px'>
                        <BodyComponent
                            value={this.getCurrent('form_value')}
                            index={this.state_index}
                            onSubmit={this.updateValue}
                            onCancel={this.prevStep}
                            onSave={this.saveFormData}
                            has_currency={this.props.has_currency}
                            form_error={this.state.form_error}
                            {...passthrough}
                        />
                    </Div100vhContainer>
                </div>
            );
        }

        const FinishedModalItem = this.getFinishedComponent();
        return <FinishedModalItem />;
    }
}

AccountWizard.propTypes = {
    fetchResidenceList: PropTypes.func,
    has_currency: PropTypes.bool,
    has_real_account: PropTypes.bool,
    onError: PropTypes.func,
    onLoading: PropTypes.func,
    onSuccessAddCurrency: PropTypes.func,
    realAccountSignup: PropTypes.func,
    residence: PropTypes.string,
    residence_list: PropTypes.array,
    setAccountCurrency: PropTypes.func,
};

export default connect(({ client }) => ({
    realAccountSignup: client.realAccountSignup,
    has_real_account: client.has_active_real_account,
    has_currency: !!client.currency,
    setAccountCurrency: client.setAccountCurrency,
    residence: client.residence,
    residence_list: client.residence_list,
    fetchResidenceList: client.fetchResidenceList,
}))(AccountWizard);
