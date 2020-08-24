import React from 'react';
import PropTypes from 'prop-types';
import { ToggleSwitch } from '@deriv/components';
import classNames from 'classnames';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { requestWS } from 'Utils/websocket';
import './my-ads.scss';

const ToggleMessage = ({ is_enabled, className, error }) => {
    const getMessage = () => {
        if (error) return error;
        if (is_enabled) return localize('Your ads are running');
        return localize('Your ads are paused');
    };
    return <p className={className}>{getMessage()}</p>;
};

ToggleMessage.propTypes = {
    className: PropTypes.string,
    is_enabled: PropTypes.bool.isRequired,
};

const ToggleAds = () => {
    const { is_listed, setIsListed } = React.useContext(Dp2pContext);
    const [error, setError] = React.useState('');

    const handleToggle = () => {
        const is_listed_ads = is_listed ? 0 : 1;
        requestWS({ p2p_advertiser_update: 1, is_listed_ads }).then(response => {
            if (response.error) {
                setError(response.error.message);
            } else {
                const { p2p_advertiser_update } = response;
                setIsListed(p2p_advertiser_update.is_listed_ads === 1);
            }
        });
    };

    return (
        <div className={classNames('toggle-ads', is_listed ? 'toggle-ads--on' : 'toggle-ads--off')}>
            <ToggleMessage
                is_enabled={is_listed}
                className='toggle-ads__message'
                error={error}
                is_loading={this.state.is_loading}
            />
            <ToggleSwitch
                id='toggle-my-ads'
                className='toggle-ads__switch'
                classNameLabel='toggle-ads__switch'
                is_enabled={is_listed}
                handleToggle={handleToggle}
            />
        </div>
    );
};

export default ToggleAds;

ToggleAds.contextType = Dp2pContext;
