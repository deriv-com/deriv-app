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
                    className={classNames('toggle-switch__label', {
                    }, this.props.classNameLabel)}
                    htmlFor={'dt_toggle_switch'}
                >
                    <span className={classNames('toggle-switch__button', {
                    }, this.props.classNameButton)}
                    />
                </label>
            </Fragment>
        );
    }
}

ToggleSwitch.propTypes = {
    className      : PropTypes.string,
    classNameButton: PropTypes.string,
    classNameLabel : PropTypes.string,
    handleToggle   : PropTypes.func,
    is_enabled     : PropTypes.bool,
};

export default ToggleSwitch;
