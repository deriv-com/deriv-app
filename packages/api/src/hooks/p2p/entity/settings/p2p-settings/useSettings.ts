import { useEffect } from 'react';
import useSubscription from '../../../../../useSubscription';
import { TSocketResponseData } from '../../../../../../types';
import { useLocalStorage } from 'usehooks-ts';

type TP2PSettings =
    | (TSocketResponseData<'p2p_settings'>['p2p_settings'] & {
          currency_list: {
              display_name: string;
              has_adverts: 0 | 1;
              is_default?: 1;
              text: string;
              value: string;
          }[];
          float_rate_offset_limit_string: string;
          is_cross_border_ads_enabled: boolean;
          is_disabled: boolean;
          is_payment_methods_enabled: boolean;
          localCurrency?: string;
          rate_type: 'float' | 'fixed';
          reached_target_date: boolean;
      })
    | undefined;

type TCurrencyListItem = {
    display_name: string;
    has_adverts: 0 | 1;
    is_default?: 1;
    text: string;
    value: string;
};

const useSettings = () => {
    const { data, ...rest } = useSubscription('p2p_settings');
    const [p2pSettings, setP2PSettings] = useLocalStorage<DeepPartial<TP2PSettings>>('p2p_v2_p2p_settings', {});

    useEffect(() => {
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

            let localCurrency;

            const currency_list = p2p_settings_data.local_currencies.reduce((acc: TCurrencyListItem[], currency) => {
                const { display_name, has_adverts, is_default, symbol } = currency;

                if (is_default) localCurrency = symbol;

                if (has_adverts) {
                    acc.push({
                        display_name,
                        has_adverts,
                        is_default,
                        text: symbol,
                        value: symbol,
                    });
                }

                return acc;
            }, []);

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
                /** Indicates the default local currency */
                localCurrency,
                /** Indicates if the current rate type is floating or fixed rates */
                rate_type: (p2p_settings_data?.float_rate_adverts === 'enabled' ? 'float' : 'fixed') as
                    | 'float'
                    | 'fixed',
                /** Indicates if the fixed rate adverts end date has been reached. */
                reached_target_date: reached_target_date(),
            });
        }
    }, [data, setP2PSettings]);

    return {
        ...rest,
        data: p2pSettings,
    };
};

export default useSettings;
