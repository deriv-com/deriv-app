import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { ToggleSwitch }     from '@deriv/components';
import classNames           from 'classnames';
import { localize }         from 'Components/i18next';
import { requestWS }        from 'Utils/websocket';
import './my-ads.scss';

const ToggleMessage = ({ is_enabled, className, error, loading }) => {
    return (
        <p className={className}>
            {error && error}
            {loading && localize('Loading...')}
            {!error && !loading && is_enabled && localize('Your ads are running')}
            {!error && !loading && !is_enabled && localize('Your ads are paused')}
        </p>
    );
};

ToggleMessage.propTypes = {
    className : PropTypes.string,
    is_enabled: PropTypes.bool.isRequired,
};

class ToggleAds extends Component {

    state = {
        is_enabled: this.props.is_enabled,
        error: '',
        loading: false,
    }

    handleToggle = () => {
        const set_active = this.state.is_enabled ? 0 : 1;
        this.setState({ loading: true });

        requestWS({ p2p_agent_update: 1, is_active: set_active }).then((response) => {
            if (response.error) {
                this.setState({ loading: false, error: response.error.message });
                return;
            }
            this.setState({ loading: false, is_enabled: !this.state.is_enabled });
        });
    }

    render () {
        return (
            <div
                className={classNames(
                    'toggle-ads',
                    this.state.is_enabled ? 'toggle-ads--on' : 'toggle-ads--off',
                )}
            >
                <ToggleSwitch
                    id='toggle-my-ads'
                    className='toggle-ads__switch'
                    classNameLabel='toggle-ads__switch'
                    is_enabled={this.state.is_enabled}
                    handleToggle={this.handleToggle}
                />
                <ToggleMessage
                    is_enabled={this.state.is_enabled}
                    className='toggle-ads__message'
                    error={this.state.error}
                    loading={this.state.loading}
                />
            </div>
        );
    }
}

ToggleAds.propTypes = {
    is_enabled: PropTypes.bool.isRequired,
};

export default ToggleAds;
