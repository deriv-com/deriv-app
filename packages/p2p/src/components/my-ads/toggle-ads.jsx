import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { localize }         from 'deriv-translations';
import { ToggleSwitch }     from 'deriv-components';
import classNames           from 'classnames';
import './my-ads.scss';

const ToggleMessage = props => {
    return (
        <p className={props.className}>
            {props.is_enabled ? localize('Your ads are running') : localize('Your ads are paused')}
        </p>
    );
};

class ToggleAds extends Component {
    render () {
        return (
            <div className={classNames(
                'toggle-ads',
                {
                    'toggle-ads--on' : this.props.is_enabled,
                    'toggle-ads--off': !this.props.is_enabled,
                }
            )}>
                <ToggleSwitch
                    id='toggle-my-ads'
                    className='toggle-ads__switch'
                    classNameLabel='toggle-ads__switch'
                    is_enabled={this.props.is_enabled}
                    handleToggle={() => {this.props.setEnabled(!this.props.is_enabled);}}
                />
                <ToggleMessage
                    is_enabled={this.props.is_enabled}
                    className='toggle-ads__message'
                />
            </div>
        );
    }
}

ToggleMessage.propTypes = {
    className : PropTypes.string,
    is_enabled: PropTypes.bool.isRequired,
};

ToggleAds.propTypes = {
    is_enabled: PropTypes.bool.isRequired,
    setEnabled: PropTypes.func.isRequired,
};

export default ToggleAds;
