import React                from 'react';
import { localize }         from 'App/i18n';
import { connect }          from 'Stores/connect';
import { toMoment }         from 'Utils/Date';
import CurrencySelector     from './currency-selector.jsx';
import FormProgress         from './form-progress.jsx';
import PersonalDetails      from './personal-details.jsx';
import TermsOfUse           from './terms-of-use.jsx';
import 'Sass/real-account-signup.scss';
import 'Sass/account-wizard.scss';

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
                const values = Object.fromEntries(new Map(Object.entries(item)));
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

    getFinishedComponent = () => {
        return this.state.finished;
    };

    nextStep = (setSubmitting) => {
        this.clearError();
        // Check if account wizard is not finished
        if (this.hasMoreSteps()) {
            this.goNext();
        } else {
            this.createRealAccount(setSubmitting);
        }
    };

    prevStep = () => {
        this.setState({
            step      : this.state.step - 1,
            form_error: '',
        });
    };

    submitForm = () => {
        return this.props.realAccountSignup(this.form_values);
    };

    updateValue = (index, value, setSubmitting) => {
        const cloned_items             = Object.assign([], this.state.items);
        cloned_items[index].form_value = value;
        this.setState({
            items: cloned_items,
        }, () => this.nextStep(setSubmitting));
    };

    getCurrent = (key) => {
        return key ? this.state.items[this.state_index][key] : this.state.items[this.state_index];
    };

    createRealAccount(setSubmitting) {
        this.submitForm()
            .then(() => setSubmitting(false))
            .catch(error_message => {
                this.setState({
                    form_error: error_message,
                }, () => setSubmitting(false));
            });
    }

    goNext() {
        this.setState({
            step: this.state.step + 1,
        });
    }

    hasMoreSteps() {
        return this.state.step + 1 < this.state.items.length;
    }

    render() {
        if (!this.state.finished) {
            const BodyComponent = this.getCurrent('body');
            return (
                <div className='account-wizard'>
                    <FormProgress
                        steps={this.state.items}
                        current_step={this.state.step}
                    />
                    <div
                        className='account-wizard__body'
                        style={{
                            height: 'calc(100% - 112px)',
                        }}
                    >
                        <BodyComponent
                            value={this.getCurrent('form_value')}
                            index={this.state_index}
                            onSubmit={this.updateValue}
                            onCancel={this.prevStep}
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

export default connect(({ client }) => ({
    realAccountSignup: client.realAccountSignup,
}))(AccountWizard);
