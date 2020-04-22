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
        const {
            active_tab_ref,
            count,
            id,
            header_content,
            is_active,
            is_label_hidden,
            label,
            top,
            bottom,
            header_fit_content,
        } = this.props;

        const classes = classNames('dc-tabs__item', {
            'dc-tabs__active': is_active,
            'dc-tabs__item--top': top,
            'dc-tabs__item--bottom': bottom,
            'dc-tabs__item--header-fit-content': header_fit_content,
            'dc-tabs__item--is-hidden': is_label_hidden,
        });
        return (
            <li id={id} className={classes} onClick={this.onClick} ref={active_tab_ref}>
                {header_content || label}
                {!!count && <Counter className='dc-tabs__item__counter' count={count} />}
            </li>
        );
    }
}

Tab.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
    is_active: PropTypes.bool,
    is_label_hidden: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
};

export default Tab;
