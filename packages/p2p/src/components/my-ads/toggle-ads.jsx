import React from 'react';
import PropTypes from 'prop-types';
import { ToggleSwitch } from '@deriv/components';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './my-ads.scss';

const ToggleAds = observer(() => {
    const { general_store, my_ads_store } = useStores();

    return (
        <div
            className={classNames('toggle-ads', {
                'toggle-ads--on': general_store.is_listed,
                'toggle-ads--off': !general_store.is_listed,
            })}
        >
            <div className='toggle-ads__message'>
                {my_ads_store.api_error || general_store.is_listed
                    ? localize('Your ads are running')
                    : localize('Your ads are paused')}
            </div>

            <ToggleSwitch
                id='toggle-my-ads'
                className='toggle-ads__switch'
                classNameLabel='toggle-ads__switch'
                is_enabled={general_store.is_listed}
                handleToggle={my_ads_store.handleToggle}
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
