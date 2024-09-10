import { useStore } from '@deriv/stores';
import { useLayoutEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';

const useFreshChat = () => {
    useScript('https://fw-cdn.com/11706964/4344125.js');

    const [isReady, setIsReady] = useState(false);
    const { client } = useStore();
    const { getFreshworksToken, is_logged_in, loginid, email, account_settings, currency, residence, user_id } = client;

    const setDefaultSettings = () => {
        window.fcWidgetMessengerConfig = {
            config: {
                headerProperty: {
                    hideChatButton: true,
                },
            },
        };

        window.fcSettings = {
            onInit() {
                window.fcWidget.on('widget:loaded', async () => {
                    setIsReady(true);
                    if (is_logged_in && loginid) {
                        const res = await window.fcWidget.user.getUUID();
                        const uuid = res.data.uuid;

                        const token = await getFreshworksToken({
                            freshchat_uuid: uuid,
                            user_id,
                            email,
                            first_name: account_settings.first_name ?? '',
                            last_name: account_settings.last_name ?? '',
                            loginid,
                            currency,
                            residence,
                        });
                        window.fcWidget.authenticate(token);
                        // window.fcWidget.user.setProperties({ cf_user_jwt: token });
                    }
                });
            },
        };
    };

    useLayoutEffect(() => {
        setDefaultSettings();
    }, []);

    return {
        isReady,
        widget: window.fcWidget,
    };
};

export default useFreshChat;
