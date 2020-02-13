import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from 'Components/icon';

const HeaderIcon = ({ icon, is_active }) => (
    <Icon
        icon={icon}
        className={classNames('dc-vertical-tab__header__icon', {
            'dc-vertical-tab__header__icon--active': is_active,
        })}
    />
);

const Header = ({ text }) => <div className='dc-vertical-tab__header__link'>{text}</div>;

const VerticalTabHeader = ({ children, className, is_floating, is_routed, item, onChange, selected }) => {
    const label = item.label || item.title; // item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase();
    const is_active = selected && selected.label === item.label;
    const handleClick = () => onChange(item);
    const id = `dt_${label}_link`;
    const is_disabled = !!item.is_disabled;

    return is_routed ? (
        <NavLink
            id={id}
            to={item.path}
            onClick={handleClick}
            className={classNames('dc-vertical-tab__header', {
                'dc-vertical-tab__header--disabled': is_disabled,
                'dc-vertical-tab__header--floating': is_floating,
            })}
            activeClassName={classNames(className, {
                'dc-vertical-tab__header--active': is_active,
            })}
        >
            <HeaderIcon icon={item.icon} is_active={is_active} />
            <Header text={label} />
            {children}
        </NavLink>
    ) : (
        <div
            id={id}
            className={classNames('dc-vertical-tab__header', className, {
                'dc-vertical-tab__header--active': is_active,
                'dc-vertical-tab__header--disabled': is_disabled,
            })}
            onClick={handleClick}
        >
            <HeaderIcon icon={item.icon} is_active={is_active} />
            <Header text={label} />
            {children}
            {item.component}
        </div>
    );
};

export default VerticalTabHeader;
