import classNames           from 'classnames';
import React, { Component } from 'react';
import PropTypes            from 'prop-types';

class Tab extends Component {
    onClick = () => {
        const { onClick } = this.props;
        onClick();
    }

    render() {
        const {
            is_active,
            label,
        } = this.props;

        return (
            <li
                className={classNames('dc-tabs__item',
                    { 'dc-tabs__active': is_active }
                )}
                onClick={this.onClick}
            >
                {label}
            </li>
        );
    }
}

Tab.propTypes = {
    className: PropTypes.string,
    is_active: PropTypes.bool,
    label    : PropTypes.string,
    onClick  : PropTypes.func,
};

export default Tab;
