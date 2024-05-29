import React, { ReactNode } from 'react';
import { useSubscription } from '@deriv/api';
import P2PSettingsContext, { TP2PSettings } from '../stores/P2PSettingsContext';
import { useLocalStorage } from 'usehooks-ts';

type TP2PSettingsProvider = {
    children: ReactNode;
};

const P2PSettingsProvider = ({ children }: TP2PSettingsProvider) => {
    const { data, subscribe, ...rest } = useSubscription('p2p_settings');
    const { isSubscribed, unsubscribe } = rest;
    const [p2p_settings, setP2PSettings] = useLocalStorage<TP2PSettings>('p2p_settings', {} as TP2PSettings);

    React.useEffect(() => {
        if (data) {
            const p2p_settings_data = data.p2p_settings;

            if (!p2p_settings_data) return undefined;

            const reached_target_date = () => {
                if (!p2p_settings_data?.fixed_rate_adverts_end_date) return false;

                const current_date = new Date(new Date().getTime()).setUTCHours(23, 59, 59, 999);
                const cutoff_date = new Date(
                    new Date(p2p_settings_data?.fixed_rate_adverts_end_date).getTime()
                ).setUTCHours(23, 59, 59, 999);

                return current_date > cutoff_date;
            };

            const currency_list = p2p_settings_data.local_currencies.map(currency => {
                const { display_name, has_adverts, is_default, symbol } = currency;

                return {
                    display_name,
                    has_adverts,
                    is_default,
                    text: symbol,
                    value: symbol,
                };
            });

            setP2PSettings({
                ...p2p_settings_data,
                /** Modified list of local_currencies */
                currency_list,
                /** Indicates the maximum rate offset for floating rate adverts. */
                float_rate_offset_limit_string:
                    p2p_settings_data?.float_rate_offset_limit?.toString().split('.')?.[1]?.length > 2
                        ? (p2p_settings_data?.float_rate_offset_limit - 0.005).toFixed(2)
                        : p2p_settings_data?.float_rate_offset_limit.toFixed(2),
                /** Indicates if the cross border ads feature is enabled. */
                is_cross_border_ads_enabled: Boolean(p2p_settings_data?.cross_border_ads_enabled),
                /** Indicates if the P2P service is unavailable. */
                is_disabled: Boolean(p2p_settings_data?.disabled),
                /** Indicates if the payment methods feature is enabled. */
                is_payment_methods_enabled: Boolean(p2p_settings_data?.payment_methods_enabled),
                /** Time allowed for order payment, in minutes after order creation. */
                order_payment_period_string: (p2p_settings_data?.order_payment_period * 60).toString(),
                /** Indicates if the current rate type is floating or fixed rates */
                rate_type: (p2p_settings_data?.float_rate_adverts === 'enabled' ? 'float' : 'fixed') as
                    | 'float'
                    | 'fixed',
                /** Indicates if the fixed rate adverts end date has been reached. */
                reached_target_date: reached_target_date(),
            });
        }

        return () => {
            isSubscribed && unsubscribe();
        };
    }, [data, isSubscribed, setP2PSettings, unsubscribe]);

    return (
        <P2PSettingsContext.Provider value={{ p2p_settings, subscribe, rest }}>{children}</P2PSettingsContext.Provider>
    );
};

export default P2PSettingsProvider;
