import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tab extends Component {
    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    }

    render() {
        const {
            activeTab,
            className,
            label,
            onClick,
        } = this.props;

        return (
            <li
                className={`dc-tab-list__item dc-tab-list__item--${className}
                ${activeTab === label || 'dc-tab-list__active'}`}
                onClick={onClick}
            >
                {label}
            </li>
        );
    }
}

Tab.PropTypes = {
    activeTab: PropTypes.string,
    className: PropTypes.string,
    label    : PropTypes.string,
    onClick  : PropTypes.func,
};

export default Tab;
