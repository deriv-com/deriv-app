import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Counter from '../counter';
import Icon from '../icon';

const Tab = ({
    active_tab_ref,
    active_icon_color,
    bottom,
    className,
    count,
    header_content,
    header_fit_content,
    icon,
    icon_color,
    icon_size,
    id,
    is_active,
    is_label_hidden,
    label,
    onClick,
    setActiveLineStyle,
    top,
}) => {
    React.useEffect(() => {
        setActiveLineStyle();
    }, [count, label, header_content]);

    const classes = classNames('dc-tabs__item', {
        'dc-tabs__active': is_active,
        [`dc-tabs__active--${className}`]: className && is_active,
        'dc-tabs__item--top': top,
        'dc-tabs__item--bottom': bottom,
        'dc-tabs__item--header-fit-content': header_fit_content,
        'dc-tabs__item--is-hidden': is_label_hidden,
        [`dc-tabs__item--${className}`]: className,
    });
    const title_color = is_active ? active_icon_color : icon_color;
    return (
        <li id={id} className={classes} style={{ color: title_color }} onClick={onClick} ref={active_tab_ref}>
            {icon && <Icon icon={icon} size={icon_size} custom_color={title_color} className='dc-tabs__item__icon' />}
            {header_content || label}
            {!!count && <Counter className='dc-tabs__item__counter' count={count} />}
        </li>
    );
};

Tab.propTypes = {
    active_tab_ref: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    active_icon_color: PropTypes.string,
    bottom: PropTypes.bool,
    className: PropTypes.string,
    count: PropTypes.number,
    header_content: PropTypes.object,
    header_fit_content: PropTypes.bool,
    icon: PropTypes.string,
    icon_color: PropTypes.string,
    icon_size: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_active: PropTypes.bool,
    is_label_hidden: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    setActiveLineStyle: PropTypes.func,
    top: PropTypes.bool,
};

export default Tab;
