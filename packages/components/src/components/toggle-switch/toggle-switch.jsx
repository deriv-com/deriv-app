import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import classNames                     from 'classnames';

class ToggleSwitch extends Component {
    render() {
        return (
            <Fragment>
                <input
                    className={classNames('toggle-switch', {
                    }, this.props.className)}
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
    is_enabled    : PropT ypes.bool,
    onStateChanged: PropTypes.func,
};

export default ToggleSwitch;
