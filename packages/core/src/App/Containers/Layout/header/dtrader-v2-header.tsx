import React from 'react';
import { observer, useStore } from '@deriv/stores';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification';
import HeaderAccountActionsDTraderV2 from 'App/Components/Layout/Header/dtrader-v2/header-account-actions-dtrader-v2';

const DTraderV2Header = observer(() => {
    const { ui, notifications } = useStore();
    const { is_real_acc_signup_on } = ui;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    return (
        <header className='header header-v2'>
            <React.Suspense fallback={<div />}>
                <HeaderAccountActionsDTraderV2 />
                {is_real_acc_signup_on && <RealAccountSignup />}
                <SetAccountCurrencyModal />
                <NewVersionNotification onUpdate={addUpdateNotification} />
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
