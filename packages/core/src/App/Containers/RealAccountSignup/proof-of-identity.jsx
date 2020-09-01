import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer } from '@deriv/components';
import { ProofOfIdentityContainer } from '@deriv/account';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import WS from 'Services/ws-methods';

class ProofOfIdentityForm extends React.PureComponent {
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
            <Formik
                initialValues={this.props.value}
                validate={this.props.validateForm}
                onSubmit={(values, actions) =>
                    this.props.onSubmit(this.props.index, { poi_state: this.state.poi_state }, actions.setSubmitting)
                }
            >
                {({ handleSubmit }) => (
                    <AutoHeightWrapper default_height={200}>
                        {({ setRef, height }) => (
                            <form ref={setRef} className='mt5-proof-of-identity' onSubmit={handleSubmit}>
                                <div className='details-form'>
                                    <input type='hidden' name='poi_state' value={this.state.poi_state} readOnly />
                                    <Div100vhContainer
                                        className='mt5-proof-of-identity__fields'
                                        height_offset='180px'
                                        is_disabled={isDesktop()}
                                    >
                                        <ProofOfIdentityContainer
                                            {...this.props}
                                            serviceToken={WS.serviceToken}
                                            notificationEvent={WS.notificationEvent}
                                            getAccountStatus={WS.authorized.getAccountStatus}
                                            height={height}
                                            onStateChange={this.onStateChange}
                                            is_trading_button_enabled={false}
                                            is_description_enabled={false}
                                        />
                                    </Div100vhContainer>
                                    <FormSubmitButton
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        is_disabled={!['pending', 'verified'].includes(this.state.poi_state)}
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                        onCancel={this.props.onCancel}
                                        form_error={this.props.form_error}
                                    />
                                </div>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
}

ProofOfIdentityForm.propTypes = {
    form_error: PropTypes.string,
    index: PropTypes.number,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onSubmit: PropTypes.func,
    refreshNotifications: PropTypes.func,
    addNotificationByKey: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    value: PropTypes.object,
};

export default ProofOfIdentityForm;
