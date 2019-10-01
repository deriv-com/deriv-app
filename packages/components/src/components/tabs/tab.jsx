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
    active_tab: PropTypes.string,
    className : PropTypes.string,
    label     : PropTypes.string,
    onClick   : PropTypes.func,
};

export default Tab;
