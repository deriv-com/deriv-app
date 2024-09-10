import { useStore } from '@deriv/stores';
import { useLayoutEffect, useState } from 'react';
import { useScript } from 'usehooks-ts';
import useGrowthbookGetFeatureValue from './useGrowthbookGetFeatureValue';

const useFreshChat = () => {
    useScript('https://fw-cdn.com/11706964/4344125.js');

    const [enable_freshworks_live_chat] = useGrowthbookGetFeatureValue({
        featureFlag: 'enable_freshworks_live_chat',
        defaultValue: true,
    });

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
                        const token = await getFreshworksToken({
                            freshchat_uuid: window.fcWidget.user.getUUID(),
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

                    if (/*isGBLoaded && */ enable_freshworks_live_chat) {
                        if (!window.LiveChatWidget) window.LiveChatWidget = {} as any;
                        window.LiveChatWidget.call = (method: string) => {
                            if (method === 'maximize') return window.fcWidget?.open();
                            if (method === 'minimize') return window.fcWidget?.close();
                            if (method === 'hide') return window.fcWidget?.hide();
                            if (method === 'destroy') return window.fcWidget?.destroy();
                        };
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
