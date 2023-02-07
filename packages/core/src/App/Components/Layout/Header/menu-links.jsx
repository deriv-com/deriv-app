import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { BinaryLink } from '../../Routes';

const MenuItems = ({ item, hide_menu_item }) => {
    const { id, link_to, href, text, image, logo, icon } = item;
    return hide_menu_item ? null : (
        <BinaryLink
            id={id}
            key={icon}
            to={link_to}
            href={href}
            className='header__menu-link'
            active_class='header__menu-link--active'
        >
            <Text size='m' line_height='xs' title={text()} className='header__menu-link-text'>
                {icon}
                {text()}
                {logo}
            </Text>
            <span className='header__menu-link-text'>
                {image}
                {logo}
            </span>
        </BinaryLink>
    );
};

const MenuLinks = ({ is_logged_in, is_mobile, items, is_pre_appstore }) => (
    <React.Fragment>
        {!!items.length && (
            <div className='header__menu-links'>
                {items.map(item => {
                    return (
                        is_logged_in && (
                            <MenuItems
                                key={`${item.icon}${item.id}`}
                                item={item}
                                hide_menu_item={
                                    is_pre_appstore &&
                                    (item?.link_to?.toLowerCase() === '/reports' ||
                                        (item?.link_to?.toLowerCase() === '/cashier' && is_mobile))
                                }
                            />
                        )
                    );
                })}
            </div>
        )}
    </React.Fragment>
);

MenuLinks.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.shape({
                className: PropTypes.string,
            }),
            is_logged_in: PropTypes.bool,
            link_to: PropTypes.string,
            text: PropTypes.func,
        })
    ),
    is_mobile: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_pre_appstore: PropTypes.bool,
};

export { MenuLinks };
