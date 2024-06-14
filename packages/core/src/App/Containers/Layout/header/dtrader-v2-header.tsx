import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import HeaderAccountActionsDTraderV2 from './header-account-actions-dtrader-v2';

const DTraderV2Header = observer(() => {
    // TODO: clean unused
    const { client, ui, notifications } = useStore();
    const { has_any_real_account, is_virtual } = client;
    const { toggleReadyToDepositModal, is_real_acc_signup_on } = ui;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;

    const history = useHistory();

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const handleClickCashier = () => {
        if (!has_any_real_account && is_virtual) {
            toggleReadyToDepositModal();
        } else {
            history.push(routes.cashier_deposit as Parameters<typeof history['push']>[0]);
        }
    };

    return (
        <header className='header header-v2'>
            <React.Suspense fallback={<div />}>
                <HeaderAccountActionsDTraderV2 onClickDeposit={handleClickCashier} />
                {is_real_acc_signup_on && <RealAccountSignup />}
                <SetAccountCurrencyModal />
                <NewVersionNotification onUpdate={addUpdateNotification} />
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
