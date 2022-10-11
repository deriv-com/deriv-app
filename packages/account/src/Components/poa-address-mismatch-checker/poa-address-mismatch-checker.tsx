import React from 'react';
import { usePrevious } from '@deriv/components';
import { GetAccountStatus } from '@deriv/api-types';
import { connect } from 'Stores/connect';
import POAAddressMismatchHintBox from 'Components/poa-address-mismatch-hint-box';

type TRootStore = {
    client: {
        account_status: GetAccountStatus;
    };
    notifications: {
        addNotificationMessageByKey: (key: string) => void;
    };
};

type TProps = {
    has_poa_address_mismatch: boolean;
    addNotificationMessageByKey: (key: string) => void;
};

const POAAddressMismatchChecker = ({ has_poa_address_mismatch, addNotificationMessageByKey }: TProps) => {
    const previous_has_poa_address_mismatch = usePrevious(has_poa_address_mismatch);

    React.useEffect(() => {
        if (previous_has_poa_address_mismatch) {
            if (has_poa_address_mismatch) {
                addNotificationMessageByKey('poa_address_mismatch_error');
            } else {
                addNotificationMessageByKey('poa_address_mismatch_success');
            }
        }
    }, [previous_has_poa_address_mismatch, has_poa_address_mismatch, addNotificationMessageByKey]);

    if (!has_poa_address_mismatch) return null;

    return <POAAddressMismatchHintBox />;
};

export default connect(({ client, notifications }: TRootStore) => ({
    has_poa_address_mismatch: client.account_status.status?.includes('poa_address_mismatch'),
    addNotificationMessageByKey: notifications.addNotificationMessageByKey,
}))(POAAddressMismatchChecker);
