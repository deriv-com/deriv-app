import { ProofOfIdentityContainer } from '@deriv/account';
import { GetAccountStatus } from '@deriv/api-types';
import { AutoHeightWrapper, Div100vhContainer, FormSubmitButton, Modal } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Formik, FormikHelpers as FormikActions } from 'formik';
import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TCFDAuthenticationStatusProps = {
    document_status: string;
    identity_status: string;
};
type TCFDValue = {
    poi_state: string;
};
type TErrors = {
    poi_state: boolean;
};

type TFormValues =
    | {
          citizen?: string;
          tax_residence?: string;
          tax_identification_number?: string;
          account_opening_reason?: string;
      }
    | {};

type TCFDAppRoutingHistory = {
    pathname: string;
};
type TCFDNotificationByKey = {
    key: string;
};
type TCFDNotificationMessage = {
    key: string;
    should_show_again: string;
};

type TCFDPOIProps = {
    authentication_status: TCFDAuthenticationStatusProps;
    form_error?: string;
    index: number;
    onCancel: () => void;
    onSubmit: (index: number, value: TCFDValue, setSubmitting: boolean | ((isSubmitting: boolean) => void)) => void;
    value: TCFDValue;
    account_status?: GetAccountStatus;
    addNotificationByKey: (key: string) => void;
    app_routing_history: Array<TCFDAppRoutingHistory>;
    fetchResidenceList?: () => void;
    height: string;
    is_loading: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    onSave: (index: number, values: TFormValues) => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (key: TCFDNotificationByKey) => void;
    removeNotificationMessage: (key: TCFDNotificationMessage) => void;
    routeBackInApp: (history: Array<string>, additional_platform_path: TCFDAppRoutingHistory) => void;
    should_allow_authentication: boolean;
};

const CFDPOI = ({ authentication_status, form_error, index, onCancel, onSubmit, value, ...props }: TCFDPOIProps) => {
    const { identity_status } = authentication_status;
    const [poi_state, setPOIState] = React.useState<string>('none');
    const validateForm = React.useCallback(() => {
        const errors = {};
        if (!['pending'].includes(poi_state) || !['pending', 'verified'].includes(identity_status)) {
            (errors as TErrors).poi_state = true;
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
            onSubmit={(_values: TFormValues, actions: FormikActions<TCFDValue>) =>
                onSubmit(index, { poi_state }, actions.setSubmitting)
            }
        >
            {({ handleSubmit }) => (
                <AutoHeightWrapper default_height={200}>
                    {({ setRef, height }: { setRef: (instance: HTMLFormElement | null) => void; height: number }) => (
                        <form ref={setRef} className='cfd-proof-of-identity' onSubmit={handleSubmit}>
                            <div className='details-form'>
                                <input type='hidden' name='poi_state' value={poi_state} readOnly />
                                <Div100vhContainer
                                    className='cfd-proof-of-identity__fields'
                                    height_offset='180px'
                                    is_disabled={isDesktop()}
                                >
                                    <ProofOfIdentityContainer
                                        {...props}
                                        height={height}
                                        is_from_external={true}
                                        onStateChange={(status: any) => setPOIState(status)}
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

export default connect(({ client, common, notifications }: RootStore) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
}))(CFDPOI);
