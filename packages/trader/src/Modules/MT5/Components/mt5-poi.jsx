import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormSubmitButton } from '@deriv/components';
import { localize } from '@deriv/translations';
import ProofOfIdentityContainer from 'Modules/Account/Sections/Verification/ProofOfIdentity/proof-of-identity-container.jsx';

class MT5POI extends PureComponent {
    state = {
        poi_state: 'none',
    };

    onStateChange = ({ status }) =>
        this.setState({
            poi_state: status,
        });

    validateForm = () => {
        const errors = {};
        if (!['pending', 'verified'].includes(this.state.poi_state)) {
            errors.poi_state = true;
        }

        return errors;
    };

    render() {
        return (
            <div id='mt5_proof_of_identity' className='details-form mt5-details-form'>
                <Formik
                    initialValues={{
                        poi_state: this.props.value.poi_state,
                    }}
                    validate={this.validateForm}
                    onSubmit={(values, actions) =>
                        this.props.onSubmit(
                            this.props.index,
                            { poi_state: this.state.poi_state },
                            actions.setSubmitting
                        )
                    }
                >
                    {({ handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit}>
                                <div className='account-form mt5-proof-of-identity'>
                                    <input type='hidden' name='poi_state' value={this.state.poi_state} readOnly />
                                    <div className='mt5-proof-of-identity__fields'>
                                        <ProofOfIdentityContainer
                                            height={420}
                                            {...this.props}
                                            onStateChange={this.onStateChange}
                                            is_trading_button_enabled={false}
                                            is_description_enabled={false}
                                        />
                                    </div>
                                </div>
                                <FormSubmitButton
                                    has_cancel
                                    cancel_label={localize('Previous')}
                                    is_disabled={!['pending', 'verified'].includes(this.state.poi_state)}
                                    label={localize('Next')}
                                    onCancel={this.props.onCancel}
                                    form_error={this.props.form_error}
                                />
                            </form>
                        );
                    }}
                </Formik>
            </div>
        );
    }
}

MT5POI.propTypes = {
    form_error: PropTypes.string,
    height: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    refreshNotifications: PropTypes.func,
    addNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    value: PropTypes.object,
};

export default MT5POI;
