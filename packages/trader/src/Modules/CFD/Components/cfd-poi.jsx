import { Formik } from 'formik';
import React from 'react';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal } from '@deriv/components';
import { ProofOfIdentityContainer } from '@deriv/account';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const CFDPOI = ({ authentication_status, form_error, index, onCancel, onSubmit, value, ...props }) => {
    const { identity_status } = authentication_status;
    const [poi_state, setPOIState] = React.useState('none');
    const validateForm = React.useCallback(() => {
        const errors = {};
        if (!['pending'].includes(poi_state) || !['pending', 'verified'].includes(identity_status)) {
            errors.poi_state = true;
        }
        return errors;
    }, [poi_state, identity_status]);

    const is_next_btn_disabled = !(
        ['pending'].includes(poi_state) || ['pending', 'verified'].includes(identity_status)
    );

    return (
        <Formik
            initialValues={{
                poi_state: value.poi_state,
            }}
            validate={validateForm}
            onSubmit={actions => onSubmit(index, { poi_state }, actions.setSubmitting)}
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }) => (
                        <form ref={setRef} className='cfd-proof-of-identity' onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <Div100vhContainer
                                    className='cfd-proof-of-identity__fields'
                                    height_offset='180px'
                                    is_disabled={isDesktop()}
                                >
                                    <ProofOfIdentityContainer
                                        height={height}
                                        is_from_external={true}
                                        onStateChange={status => setPOIState(status)}
                                        {...props}
                                    />
                                </Div100vhContainer>
                                <Modal.Footer is_bypassed={isMobile()}>
                                    <FormSubmitButton
                                        has_cancel
                                        cancel_label={localize('Previous')}
                                        is_disabled={is_next_btn_disabled}
                                        is_absolute={isMobile()}
                                        label={localize('Next')}
                                        onCancel={onCancel}
                                        form_error={form_error}
                                        onClick={() => {
                                            if (!is_next_btn_disabled) {
                                                onSubmit(index, { poi_state }, false);
                                            }
                                        }}
                                    />
                                </Modal.Footer>
                            </div>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

export default connect(({ client, common }) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: client.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
}))(CFDPOI);
