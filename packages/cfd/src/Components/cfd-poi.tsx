import { ProofOfIdentityContainerforMt5 } from '@deriv/account';
import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import React from 'react';
import RootStore from 'Stores/index';
import { connect } from 'Stores/connect';

type TCFDValue = {
    poi_state: string;
};

type TFormValues = {
    poi_state?: string;
};

type TCFDNotificationByKey = {
    key: string;
};
type TCFDNotificationMessage = {
    key: string;
    should_show_again: string;
};

export type TCFDPOIProps = {
    index: number;
    onSubmit: (index: number, value: TCFDValue) => void;
    value: TCFDValue;
    account_status?: GetAccountStatus;
    addNotificationByKey: (key: string) => void;
    fetchResidenceList?: () => void;
    height: string;
    is_cfd_poi_completed: boolean;
    is_loading: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    setIsCfdPoiCompleted: (status: boolean) => void;
    onSave: (index: number, values: TFormValues) => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (key: TCFDNotificationByKey) => void;
    removeNotificationMessage: (key: TCFDNotificationMessage) => void;
    should_allow_authentication: boolean;
    account_settings: GetSettings;
    residence_list: ResidenceList;
    jurisdiction_selected_shortcode: string;
};

const CFDPOI = ({
    authentication_status,
    form_error,
    index,
    is_cfd_poi_completed,
    setIsCfdPoiCompleted,
    onCancel,
    onSave,
    onSubmit,
    value,
    height,
    ...props
}: TCFDPOIProps) => {
    const { identity_status } = authentication_status;
    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizen = props.account_settings?.citizen || props.account_settings?.country_code;
    const citizen_data = props.residence_list?.find(item => item.value === citizen);

    // we need extra variable since the state has issues with updating under some conditions
    const is_next_btn_disabled = !(
        ['pending'].includes(poi_state) || ['pending', 'verified'].includes(identity_status)
    );
    const [is_next_btn_disabled_state, setIsNextBtnDisabled] = React.useState(is_next_btn_disabled);

    const validateForm = React.useCallback(() => {
        const errors = {};
        if (!['pending'].includes(poi_state) || !['pending', 'verified'].includes(identity_status)) {
            (errors as TErrors).poi_state = true;
        }
        return errors;
    }, [poi_state, identity_status]);

    React.useEffect(() => {
        if (is_cfd_poi_completed) {
            setIsNextBtnDisabled(false);
        }
    }, [is_cfd_poi_completed]);

    const onStateChange = (status: string) => {
        setPOIState(status);
        onSave(index, { poi_state: status });
        onSubmit(index, { poi_state });
    };
    return (
        <ProofOfIdentityContainerforMt5
            {...props}
            height={height}
            is_from_external={true}
            onStateChange={(status: string) => onStateChange(status)}
            citizen_data={citizen_data}
        />
    );
};

export default connect(({ client, common, notifications }: RootStore) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    fetchResidenceList: client.fetchResidenceList,
    is_cfd_poi_completed: client.is_cfd_poi_completed,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    setIsCfdPoiCompleted: client.setIsCfdPoiCompleted,
    should_allow_authentication: client.should_allow_authentication,
    account_settings: client.account_settings,
    residence_list: client.residence_list,
}))(CFDPOI);
