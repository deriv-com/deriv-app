import React from 'react';
import PropTypes from 'prop-types';
import { Text, ToggleSwitch } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { requestWS } from 'Utils/websocket';
import { Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import './my-ads.scss';

const ToggleAds = observer(() => {
    const { general_store, my_ads_store } = useStores();
    const isMounted = useIsMounted();

    const handleToggle = () => {
        // Ads are automatically disabled when the user is barred
        if (!general_store.is_barred) {
            requestWS({
                p2p_advertiser_update: 1,
                is_listed: general_store.is_listed ? 0 : 1,
            }).then(response => {
                if (isMounted()) {
                    if (response.error) {
                        my_ads_store.setApiError(response.error.message);
                    } else {
                        const { is_listed } = response.p2p_advertiser_update;
                        general_store.setIsListed(is_listed === 1);
                    }
                }
            });
        }
    };

    return (
        <div className='toggle-ads'>
            <Text
                className='toggle-ads__message'
                color={general_store.is_listed ? 'less-prominent' : 'profit-success'}
                line_height='xl'
                size='xs'
            >
                <Localize i18n_default_text='Hide my ads' />
            </Text>
            <ToggleSwitch
                id='toggle-my-ads'
                is_enabled={general_store.is_barred || !general_store.is_listed}
                handleToggle={handleToggle}
            />
        </div>
    );
});

ToggleAds.propTypes = {
    api_error: PropTypes.string,
    handleToggle: PropTypes.func,
    is_listed: PropTypes.bool,
};

export default ToggleAds;
