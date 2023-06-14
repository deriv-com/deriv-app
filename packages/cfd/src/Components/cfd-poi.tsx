import { ProofOfIdentityContainerForMt5 } from '@deriv/account';
import React from 'react';
import { useStore, observer } from '@deriv/stores';

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
    addNotificationMessageByKey: (key: string) => void;
    height: string;
    onSave: (index: number, values: TFormValues) => void;
    removeNotificationByKey: (key: TCFDNotificationByKey) => void;
    removeNotificationMessage: (key: TCFDNotificationMessage) => void;
    jurisdiction_selected_shortcode: string;
};

const CFDPOI = observer(({ index, onSave, onSubmit, height, ...props }: TCFDPOIProps) => {
    const { client, common, notifications } = useStore();

    const {
        account_status,
        fetchResidenceList,
        is_switching,
        is_virtual,
        is_high_risk,
        is_withdrawal_lock,
        should_allow_authentication,
        account_settings,
        residence_list,
        getChangeableFields,
        updateAccountStatus,
    } = client;
    const { routeBackInApp, app_routing_history } = common;
    const { refreshNotifications } = notifications;

    const poi_props = {
        account_status,
        fetchResidenceList,
        is_switching,
        is_virtual,
        is_high_risk,
        is_withdrawal_lock,
        should_allow_authentication,
        account_settings,
        residence_list,
        routeBackInApp,
        app_routing_history,
        refreshNotifications,
        getChangeableFields,
        updateAccountStatus,
        ...props,
    };

    const [poi_state, setPOIState] = React.useState<string>('none');
    const citizen = account_settings?.citizen || account_settings?.country_code;
    const citizen_data = residence_list?.find(item => item.value === citizen);

    const onStateChange = (status: string) => {
        setPOIState(status);
        onSave(index, { poi_state: status });
        onSubmit(index, { poi_state });
    };
    return (
        <ProofOfIdentityContainerForMt5
            {...poi_props}
            height={height}
            is_from_external={true}
            onStateChange={(status: string) => onStateChange(status)}
            citizen_data={citizen_data}
        />
    );
});

export default CFDPOI;
