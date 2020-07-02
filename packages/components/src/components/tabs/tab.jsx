import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Counter from '../counter';

class Tab extends React.Component {
    onClick = () => {
        const { onClick } = this.props;
        onClick();
    };

    componentDidUpdate(prev_props) {
        if (
            prev_props.count !== this.props.count ||
            prev_props.label !== this.props.label ||
            prev_props.header_content !== this.props.header_content
        ) {
            this.props.setActiveLineStyle();
        }
    }

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
