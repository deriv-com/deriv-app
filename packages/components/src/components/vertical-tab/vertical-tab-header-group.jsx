import classNames from 'classnames';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../icon/icon';

const HeaderIcon = ({ icon, is_active }) => (
    <Icon
        icon={icon}
        className={classNames('dc-vertical-tab__header-group__icon', {
            'dc-vertical-tab__header-group__icon--active': is_active,
        })}
    />
);

const Header = ({ text }) => <div className='dc-vertical-tab__header-group__link'>{text}</div>;

const VerticalTabHeaderGroup = ({
    children,
    className,
    group,
    selected,
    is_collapsible = true,
    is_routed,
    onChange,
    onToggle,
}) => {
    const [show_items, setShowItems] = React.useState(true);

    React.useEffect(() => {
        onToggle(true);
    }, [show_items, onToggle]);

    const label = typeof group.getTitle === 'function' ? group.getTitle() : group.label || group.title;
    const handleClick = () => {
        if (!group.subitems && typeof onChange === 'function') {
            onChange(group);
        } else if (is_collapsible && !selected) {
            setShowItems(!show_items);
        }
    };
    const id = `dt_${label}_link`;
    const is_disabled = !!group.is_disabled;

    return is_routed && !group.subitems ? (
        <NavLink
            id={id}
            to={group.path}
            className={classNames('dc-vertical-tab__header-group', className, {
                'dc-vertical-tab__header-group--active': selected,
                'dc-vertical-tab__header-group--disabled': is_disabled || selected,
            })}
            onClick={handleClick}
        >
            <HeaderIcon icon={group.icon} is_active={selected} />
            <Header text={label} />
            {is_collapsible && (
                <Icon
                    icon='IcChevronUpBold' // Point up because default state of tab header group is open
                    className={classNames('dc-vertical-tab__header-group-chevron', {
                        'dc-vertical-tab__header-group-chevron--invert': !show_items,
                    })}
                />
            )}
        </NavLink>
    ) : (
        <>
            <div
                id={id}
                className={classNames('dc-vertical-tab__header-group', className, {
                    'dc-vertical-tab__header-group--active': selected,
                    'dc-vertical-tab__header-group--disabled': is_disabled || selected,
                })}
                onClick={handleClick}
            >
                <HeaderIcon icon={group.icon} is_active={selected} />
                <Header text={label} />
                {is_collapsible && (
                    <Icon
                        icon='IcChevronUpBold' // Point up because default state of tab header group is open
                        className={classNames('dc-vertical-tab__header-group-chevron', {
                            'dc-vertical-tab__header-group-chevron--invert': !show_items,
                        })}
                    />
                )}
            </div>
            {show_items && <div>{children}</div>}
        </>
    );
};

export default VerticalTabHeaderGroup;
