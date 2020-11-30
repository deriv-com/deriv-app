import React from 'react';
import { ToggleSwitch } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import { useStores } from '../../../stores';
import './my-ads.scss';

const ToggleAds = observer(() => {
    const { general_store } = useStores();
    const [api_error, setApiError] = React.useState(null);
    const isMounted = useIsMounted();

    const handleToggle = () => {
        requestWS({
            p2p_advertiser_update: 1,
            is_listed: general_store.is_listed ? 0 : 1,
        }).then(response => {
            if (isMounted()) {
                if (response.error) {
                    setApiError(response.error.message);
                } else {
                    const { is_listed } = response.p2p_advertiser_update;
                    general_store.setIsListed(is_listed === 1);
                }
            }
        });
    };

    return (
        <div
            className={classNames('toggle-ads', {
                'toggle-ads--on': general_store.is_listed,
                'toggle-ads--off': !general_store.is_listed,
            })}
        >
            <div className='toggle-ads__message'>
                {api_error || general_store.is_listed
                    ? localize('Your ads are running')
                    : localize('Your ads are paused')}
            </div>

            <ToggleSwitch
                id='toggle-my-ads'
                className='toggle-ads__switch'
                classNameLabel='toggle-ads__switch'
                is_enabled={general_store.is_listed}
                handleToggle={handleToggle}
            />
        </div>
    );
});

export default ToggleAds;
