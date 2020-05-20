import React from 'react';
import PropTypes from 'prop-types';
import { ToggleSwitch } from '@deriv/components';
import classNames from 'classnames';
import { localize } from 'Components/i18next';
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

class ToggleAds extends React.Component {
    state = {
        error: '',
        is_enabled: this.props.is_enabled,
    };

    handleToggle = () => {
        const is_listed = this.state.is_enabled ? 0 : 1;
        const onToggleFn = this.props.onToggle || (() => {});

        onToggleFn(!this.state.is_enabled);
        this.setState({ error: '', is_enabled: !this.state.is_enabled });

        requestWS({ p2p_advertiser_update: 1, is_listed }).then(response => {
            if (response.error) {
                onToggleFn(!this.state.is_enabled);
                this.setState({ error: response.error.message, is_enabled: !this.state.is_enabled });
            }
        });
    };

    render() {
        return (
            <div className={classNames('toggle-ads', this.state.is_enabled ? 'toggle-ads--on' : 'toggle-ads--off')}>
                <ToggleMessage
                    is_enabled={this.state.is_enabled}
                    className='toggle-ads__message'
                    error={this.state.error}
                    is_loading={this.state.is_loading}
                />
                <ToggleSwitch
                    id='toggle-my-ads'
                    className='toggle-ads__switch'
                    classNameLabel='toggle-ads__switch'
                    is_enabled={this.state.is_enabled}
                    handleToggle={this.handleToggle}
                />
            </div>
        );
    }
}

ToggleAds.propTypes = {
    is_enabled: PropTypes.bool.isRequired,
};

export default ToggleAds;
