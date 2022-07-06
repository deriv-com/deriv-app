import { ProofOfIdentityContainerforMt5 } from '@deriv/account';
import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import { AutoHeightWrapper, Div100vhContainer, FormSubmitButton, Modal, Button } from '@deriv/components';
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

type TFormValues = {
    poi_state?: string;
}

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
    account_settings: GetSettings;
    residence_list: ResidenceList;
};

const CFDPOI = ({ authentication_status, form_error, index, onSave, onSubmit, value, ...props }: TCFDPOIProps) => {
    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizen = props.account_settings.citizen || props.account_settings.country_code;
    const citizen_data = props.residence_list.find(item => item.value === citizen);

    const onStateChange = (status: string) => {
        setPOIState(status);
        console.log('STATUS', status);

        onSave(index, { poi_state: status });
        onSubmit(index, { poi_state }, false)
    }
    return (
        <ProofOfIdentityContainerforMt5
            {...props}
            height={'620'}
            is_from_external={true}
            onStateChange={(status: string) => onStateChange(status)}
            citizen_data={citizen_data}
        />
    )
}


export default connect(({ client, common, notifications }: RootStore) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    account_settings: client.account_settings,
    residence_list: client.residence_list,
}))(CFDPOI);
