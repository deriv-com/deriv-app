import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames';

class ToggleSwitch extends Component {
    state = { is_enabled: this.props.is_enabled }

    toggleSwitch(e) {
        e.persist();
        e.preventDefault();

        const { onClick, onStateChanged } = this.props;
        const { is_enabled } = this.state;

        this.setState({ is_enabled: !is_enabled }, () => {
            const state = this.state;
      
            // Augument the event object with SWITCH_STATE
            const switchEvent = Object.assign(e, { SWITCH_STATE: state });
      
            // Execute the callback functions
            onClick(switchEvent);
            onStateChanged(state);
        });
    }

    render() {
        const { is_enabled } = this.state;

        // Isolate special props and store the remaining as ...props
        const { is_enabled: is_enabled_props, theme, onClick, className, onStateChanged, ...props } = this.props;

        const switchTheme = theme || 'default';

        const switch_classes = classnames(
            `switch switch--${switchTheme}`,
            className
        );
        const toggle_classes = classnames(
            'switch-toggle',
            `switch-toggle--${is_enabled ? 'on' : 'off'}`
        );

        return (
            <div className={switch_classes} onClick={this.toggleSwitch} {...props}>
                <div className={toggle_classes} />
            </div>
        );
    }
}

ToggleSwitch.propTypes = {
    is_enabled    : PropTypes.bool,
    onStateChanged: PropTypes.func,
};

export default ToggleSwitch;
