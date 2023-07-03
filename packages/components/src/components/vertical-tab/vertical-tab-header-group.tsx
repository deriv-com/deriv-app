import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import Icon from '../icon/icon';
import { THeader, THeaderIcon, TItem } from './vertical-tab-header';

type TVerticalTabHeaderGroup = {
    className?: string;
    group: TItem;
    selected: boolean;
    is_collapsible?: boolean;
    is_routed?: boolean;
    onChange: (group: TItem) => void;
    onToggle: (toggle: boolean) => void;
};

const HeaderIcon = ({ icon, is_active }: THeaderIcon) => (
    <Icon
        icon={icon}
        className={classNames('dc-vertical-tab__header-group__icon', {
            'dc-vertical-tab__header-group__icon--active': is_active,
        })}
    />
);

const Header = ({ text }: THeader) => <div className='dc-vertical-tab__header-group__link'>{text}</div>;

const VerticalTabHeaderGroup = ({
    children,
    className,
    group,
    selected,
    is_collapsible = true,
    is_routed,
    onChange,
    onToggle,
}: React.PropsWithChildren<TVerticalTabHeaderGroup>) => {
    const [show_items, setShowItems] = React.useState(true);

    React.useEffect(() => {
        onToggle(true);
    }, [show_items, onToggle]);

    const label = group.getTitle ? group.getTitle() : group.label || group.title || '';
    const handleClick = () => {
        if (!group.subitems) {
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
