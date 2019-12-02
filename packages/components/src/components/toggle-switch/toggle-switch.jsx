import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';

class ToggleSwitch extends Component {
    render() {
        return (
            <Fragment>
                <input
                    className='toggle-switch'
                    id={'dt_toggle_switch'}
                    type='checkbox'
                    checked={this.props.is_enabled}
                    onChange={this.props.handleToggle}
                />
                <label
                    className='toggle-switch__label'
                    htmlFor={'dt_toggle_switch'}
                >
                    <span className={'toggle-switch__button'} />
                </label>
            </Fragment>
        );
    }
}

ToggleSwitch.propTypes = {
    is_enabled    : PropTypes.bool,
    onStateChanged: PropTypes.func,
};

export default ToggleSwitch;
