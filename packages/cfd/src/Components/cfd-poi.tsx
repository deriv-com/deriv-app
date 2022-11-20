import { ProofOfIdentityContainerForMt5 } from '@deriv/account';
import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import React from 'react';
import RootStore from '../Stores/index';
import { connect } from '../Stores/connect';

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
    is_switching: boolean;
    is_virtual: boolean;
    is_high_risk: boolean;
    is_withdrawal_lock: boolean;
    onSave: (index: number, values: TFormValues) => void;
    refreshNotifications: () => void;
    removeNotificationByKey: (key: TCFDNotificationByKey) => void;
    removeNotificationMessage: (key: TCFDNotificationMessage) => void;
    should_allow_authentication: boolean;
    account_settings: GetSettings;
    residence_list: ResidenceList;
    jurisdiction_selected_shortcode: string;
};

const CFDPOI = ({ index, onSave, onSubmit, height, ...props }: TCFDPOIProps) => {
    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizen = props.account_settings?.citizen || props.account_settings?.country_code;
    const citizen_data = props.residence_list?.find(item => item.value === citizen);

    const onStateChange = (status: string) => {
        setPOIState(status);
        onSave(index, { poi_state: status });
        onSubmit(index, { poi_state });
    };
    return (
        <ProofOfIdentityContainerForMt5
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
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    is_high_risk: client.is_high_risk,
    is_withdrawal_lock: client.is_withdrawal_lock,
    refreshNotifications: notifications.refreshNotifications,
    routeBackInApp: common.routeBackInApp,
    should_allow_authentication: client.should_allow_authentication,
    account_settings: client.account_settings,
    residence_list: client.residence_list,
}))(CFDPOI);
