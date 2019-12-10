import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { ToggleSwitch }     from 'deriv-components';
import classNames           from 'classnames';
import { localize }         from 'Components/i18next';
import './my-ads.scss';

const ToggleMessage = ({ is_enabled, className }) => {
    return (
        <p className={className}>
            {is_enabled ? localize('Your ads are running') : localize('Your ads are paused')}
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
    }

    setEnabled (is_enabled) {
        this.setState({ is_enabled });
    }

    render () {
        return (
            <div className={classNames(
                'toggle-ads',
                this.state.is_enabled ? 'toggle-ads--on' : 'toggle-ads--off',
            )}>
                <ToggleSwitch
                    id='toggle-my-ads'
                    className='toggle-ads__switch'
                    classNameLabel='toggle-ads__switch'
                    is_enabled={this.state.is_enabled}
                    handleToggle={() => {this.setEnabled(!this.state.is_enabled);}}
                />
                <ToggleMessage
                    is_enabled={this.state.is_enabled}
                    className='toggle-ads__message'
                />
            </div>
        );
    }
}

ToggleAds.propTypes = {
    is_enabled: PropTypes.bool.isRequired,
};

export default ToggleAds;
