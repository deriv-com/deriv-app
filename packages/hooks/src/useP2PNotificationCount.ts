import { useStore } from '@deriv/stores';
import { useEffect, useState } from 'react';

type TNotification = {
    order_id: string;
    is_seen: boolean;
    is_active: boolean;
};

type TClientData = {
    is_cached: boolean;
    notifications: TNotification[];
};

type TP2PSettings = Record<string, TClientData>;

const useP2PNotificationCount = () => {
    const [p2p_settings, setP2PSettings] = useState<TP2PSettings>(
        JSON.parse(localStorage.getItem('p2p_settings') || '{}')
    );
    const { client } = useStore();
    const { loginid } = client;
    const notifications = loginid ? p2p_settings[loginid]?.notifications : null;

    useEffect(() => {
        const onStorageChanged = () => {
            const data = localStorage.getItem('p2p_settings');

            if (data) {
                setP2PSettings(JSON.parse(data));
            }
        };

        window.addEventListener('storage', onStorageChanged);

        return () => {
            window.removeEventListener('storage', onStorageChanged);
        };
    }, []);

    const p2p_notification_count = notifications?.filter(notification => !notification.is_seen).length || 0;

    return p2p_notification_count;
};

export default useP2PNotificationCount;
