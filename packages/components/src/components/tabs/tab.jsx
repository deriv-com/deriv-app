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
            top,
            bottom,
        } = this.props;

        const classes = classNames('dc-tabs__item', {
            'dc-tabs__active'      : is_active,
            'dc-tabs__item--top'   : top,
            'dc-tabs__item--bottom': bottom,
        });
        return (
            <li
                className={classes}
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
