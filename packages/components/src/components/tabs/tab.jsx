import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Counter from '../counter';

class Tab extends Component {
    onClick = () => {
        const { onClick } = this.props;
        onClick();
    };

    render() {
        const { count, is_active, label, top, bottom } = this.props;

        const classes = classNames('dc-tabs__item', {
            'dc-tabs__active': is_active,
            'dc-tabs__item--top': top,
            'dc-tabs__item--bottom': bottom,
        });
        return (
            <li className={classes} onClick={this.onClick}>
                {label}
                {!!count && <Counter className='dc-tabs__item__counter' count={count} />}
            </li>
        );
    }
}

Tab.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
    is_active: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
};

export default Tab;
