import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { BinaryLink } from '../../Routes';

const getMenuLinks = (item, hide_menu_item) => {
    return hide_menu_item ? null : (
        <BinaryLink
            id={item.id}
            key={item.id}
            to={item?.link_to}
            onClick={item?.onClick}
            href={item?.href}
            className='header__menu-link'
            active_class='header__menu-link--active'
        >
            <Text size='m' line_height='xs' title={item.text()} className='header__menu-link-text'>
                {item.icon}
                {item.text()}
                {item.logo}
            </Text>
            <span className='header__menu-link-text'>
                {item.image}
                {item.logo}
            </span>
        </BinaryLink>
    );
};

const MenuLinks = ({ is_logged_in, items, is_pre_appstore }) => (
    <React.Fragment>
        {!!items.length && (
            <div className='header__menu-links'>
                {items.map(item => {
                    return is_logged_in && getMenuLinks(item, item.text() === 'Reports' && is_pre_appstore);
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
    is_logged_in: PropTypes.bool,
    is_pre_appstore: PropTypes.bool,
};

export { MenuLinks };
