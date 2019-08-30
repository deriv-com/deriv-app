import classNames from 'classnames';
import React      from 'react';
import { NavLink } from 'react-router-dom';
import Icon        from 'Assets/icon.jsx';

const HeaderIcon = ({ icon, is_active }) => (
    <Icon
        icon={icon}
        className={classNames('vertical-tab__header__icon', {
            'vertical-tab__header__icon--active': is_active,
        })}
    />
)

const Header = ({ text }) => <div className='vertical-tab__header__link'>{text}</div>;

const VerticalTabHeader = ({ is_routed, item, onChange, selected }) => {
    const label       = item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase();
    const is_active   = selected && selected.label === item.label;
    const handleClick = () => onChange(item);
    const id          = `dt_${label}_link`;

    return (
        is_routed ?
            <NavLink
                id={id}
                to={item.path}
                onClick={handleClick}
                className='vertical-tab__header'
                activeClassName={
                    classNames({
                        'vertical-tab__header--active': is_active,
                    })
                }
            >
                <HeaderIcon icon={item.icon} is_active={is_active} />
                <Header text={label} />
            </NavLink>
            :
            <div
                id={id}
                className={
                    classNames('vertical-tab__header', {
                        'vertical-tab__header--active': is_active,
                    })
                }
                onClick={handleClick}
            >
                <HeaderIcon icon={item.icon} is_active={is_active} />
                <Header text={label} />
            </div>
    );
}

export { VerticalTabHeader }