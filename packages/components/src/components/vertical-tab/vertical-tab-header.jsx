import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { getKebabCase } from '@deriv/shared';
import Counter from '../counter';
import Icon from '../icon/icon';

const HeaderIcon = ({ icon, is_active }) => (
    <Icon
        icon={icon}
        className={classNames('dc-vertical-tab__header__icon', {
            'dc-vertical-tab__header__icon--active': is_active,
        })}
    />
);

const Header = ({ text, path }) => (
    <div className='dc-vertical-tab__header__link' id={path}>
        {text}
    </div>
);

const VerticalTabHeader = ({
    children,
    className,
    is_floating,
    is_routed,
    item,
    onChange,
    selected,
    selectedKey = 'label',
}) => {
    const label = item.label || item.title || item.getTitle?.();
    const is_active = selected && selected[selectedKey] === item[selectedKey];
    const handleClick = () => onChange(item);
    const id = `dc_${getKebabCase(label)}_link`;
    const is_disabled = !!item.is_disabled;
    const is_hidden = !!item.is_hidden;
    const count = item.count || 0;

    if (is_hidden) return null;

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
            <Header text={label} path={item.path} />
            {!!count && <Counter count={count} className='dc-vertical-tab__header__counter' />}
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
