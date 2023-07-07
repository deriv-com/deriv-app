import React from 'react';
import { Text, ToggleSwitch } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';

const ToggleAds = () => {
    const { general_store, my_ads_store } = useStores();
    const { is_barred, is_listed, setIsListed } = general_store;
    const isMounted = useIsMounted();

    const handleToggle = () => {
        // Ads are automatically disabled when the user is barred
        if (!is_barred) {
            requestWS({
                p2p_advertiser_update: 1,
                is_listed: is_listed ? 0 : 1,
            }).then(response => {
                if (isMounted()) {
                    if (response?.error) {
                        my_ads_store.setApiError(response?.error?.message);
                    } else {
                        const { is_listed: is_ad_listed } = response?.p2p_advertiser_update ?? {};
                        setIsListed(is_ad_listed === 1);
                    }
                }
            });
        }
    };

    return (
        <div className='toggle-ads'>
            <Text
                className='toggle-ads__message'
                color={`${is_listed ? 'profit-success' : 'less-prominent'}`}
                line_height='xl'
                size='xs'
            >
                {(my_ads_store.api_error || is_listed) && !is_barred ? (
                    <Localize i18n_default_text='Your ads are running' />
                ) : (
                    <Localize i18n_default_text='Your ads are paused' />
                )}
            </Text>
            <ToggleSwitch id='toggle-my-ads' is_enabled={is_listed && !is_barred} handleToggle={handleToggle} />
        </div>
    );
};

export default observer(ToggleAds);
