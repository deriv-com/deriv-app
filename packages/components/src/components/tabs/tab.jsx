import classNames           from 'classnames';
import React, { Component } from 'react';
import PropTypes            from 'prop-types';

class Tab extends Component {
    onClick = () => {
        const { label, onClick } = this.props;
        onClick(label);
    }

    render() {
        const {
            activeTab,
            label,
        } = this.props;

        return (
            <li
                className={classNames(
                    'dc-tabs__item',
                    { 'dc-tabs__active': activeTab === label }
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
    label    : PropTypes.string,
    onClick  : PropTypes.func,
};

export default Tab;
