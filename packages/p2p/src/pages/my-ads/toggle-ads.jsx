import React from 'react';
import PropTypes from 'prop-types';
import { ToggleSwitch } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { requestWS } from 'Utils/websocket';
import { localize } from 'Components/i18next';
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
        <div
            className={classNames('toggle-ads', {
                'toggle-ads--on': general_store.is_listed,
                'toggle-ads--off': !general_store.is_listed || general_store.is_barred,
            })}
        >
            <div className='toggle-ads__message'>
                {(my_ads_store.api_error || general_store.is_listed) && !general_store.is_barred
                    ? localize('Your ads are running')
                    : localize('Your ads are paused')}
            </div>

            <ToggleSwitch
                id='toggle-my-ads'
                is_enabled={general_store.is_listed && !general_store.is_barred}
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
