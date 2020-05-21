import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ToggleSwitch extends React.Component {
    render() {
        return (
            <>
                <input
                    className={classNames('dc-toggle-switch', {}, this.props.className)}
                    id={this.props.id}
                    type='checkbox'
                    checked={this.props.is_enabled}
                    onChange={this.props.handleToggle}
                />
                <label
                    className={classNames('dc-toggle-switch__label', {}, this.props.classNameLabel)}
                    htmlFor={this.props.id}
                >
                    <span className={classNames('dc-toggle-switch__button', {}, this.props.classNameButton)} />
                </label>
            </>
        );
    }
}

ToggleSwitch.propTypes = {
    className: PropTypes.string,
    classNameButton: PropTypes.string,
    classNameLabel: PropTypes.string,
    handleToggle: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    is_enabled: PropTypes.bool.isRequired,
};

export default ToggleSwitch;
