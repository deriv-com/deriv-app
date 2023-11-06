// @ts-expect-error remove this line when ProofOfIdentityContainerForMt5 is converted to TS
import ProofOfIdentityContainerForMt5 from '@deriv/account/src/Sections/Verification/ProofOfIdentity/proof-of-identity-container-for-mt5.jsx';
import React from 'react';
import { useStore, observer } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';

type TCFDValue = {
    poi_state: string;
};

type TFormValues = {
    poi_state?: string;
};

export type TCFDPOIProps = {
    index: number;
    onSubmit: (index: number, value: TCFDValue) => void;
    value: TCFDValue;
    addNotificationMessageByKey: TCoreStores['notifications']['addNotificationMessageByKey'];
    height: string;
    onSave: (index: number, values: TFormValues) => void;
    removeNotificationByKey: TCoreStores['notifications']['removeNotificationByKey'];
    removeNotificationMessage: TCoreStores['notifications']['removeNotificationMessage'];
    jurisdiction_selected_shortcode: string;
};

const CFDPOI = observer(({ index, onSave, onSubmit, ...props }: TCFDPOIProps) => {
    const { client } = useStore();
    const { account_settings, residence_list } = client;

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
            {...props}
            onStateChange={(status: string) => onStateChange(status)}
            citizen_data={citizen_data}
        />
    );
});

export default CFDPOI;
