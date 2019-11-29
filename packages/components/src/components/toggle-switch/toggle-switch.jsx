import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';

class ToggleSwitch extends Component {
    state = { is_enabled: this.props.is_enabled }

    render() {
        return (
            <div>
                { this.state.is_enabled && <p>is_enabled</p> }
                Hello Toggle
            </div>
        );
    }
}

ToggleSwitch.propTypes = {
    is_enabled    : PropTypes.bool,
    onStateChanged: PropTypes.func,
};

export default ToggleSwitch;
