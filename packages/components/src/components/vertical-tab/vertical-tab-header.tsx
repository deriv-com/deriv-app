import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { getKebabCase } from '@deriv/shared';
import Counter from '../counter';
import Icon from '../icon/icon';

export type THeaderIcon = {
    icon: string;
    is_active: boolean;
};

export type THeader = {
    text: string;
    path?: string;
};

export type TItem = {
    component?: typeof React.Component;
    count?: number;
    default?: boolean;
    getTitle?: () => string;
    has_side_note?: boolean;
    icon: string;
    is_hidden?: boolean;
    is_disabled?: boolean;
    label?: string;
    path?: string;
    subitems?: number[];
    title?: string;
    value?: typeof React.Component;
};
type TVerticalTabHeader = {
    className?: string;
    is_floating?: boolean;
    is_routed?: boolean;
    item: TItem;
    onChange: (item: TItem) => void;
    selected: TItem;
    selectedKey: string;
};

const HeaderIcon = ({ icon, is_active }: THeaderIcon) => (
    <Icon
        icon={icon}
        className={classNames('dc-vertical-tab__header__icon', {
            'dc-vertical-tab__header__icon--active': is_active,
        })}
    />
);

const Header = ({ text, path }: THeader) => (
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
}: React.PropsWithChildren<TVerticalTabHeader>) => {
    const label = item.label || item.title || item.getTitle?.() || '';
    const is_active = selected && selected[selectedKey as keyof TItem] === item[selectedKey as keyof TItem];
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
            <>{item.component}</>
        </div>
    );
};

export default VerticalTabHeader;
