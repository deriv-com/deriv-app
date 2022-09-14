import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { BinaryLink } from '../../Routes';

const MenuLinks = ({ is_logged_in, items, is_pre_appstore }) => (
    <React.Fragment>
        {!!items.length && (
            <div className='header__menu-links'>
                {items.map((item, idx) => {
                    const item_text = item.text();

                    if (!is_pre_appstore && is_logged_in) {
                        return (
                            <BinaryLink
                                id={item.id}
                                key={idx}
                                to={item?.link_to}
                                onClick={item?.onClick}
                                href={item?.href}
                                className='header__menu-link'
                                active_class='header__menu-link--active'
                            >
                                <React.Fragment>
                                    {item_text && (
                                        <Text
                                            size='m'
                                            line_height='xs'
                                            title={item_text}
                                            className='header__menu-link-text'
                                        >
                                            {item.icon}
                                            {item_text}
                                            {item.logo}
                                        </Text>
                                    )}
                                    {item.image && (
                                        <span className='header__menu-link-text'>
                                            {item.image}
                                            {item.logo}
                                        </span>
                                    )}
                                </React.Fragment>
                            </BinaryLink>
                        );
                    } else if (is_pre_appstore && is_logged_in && item_text !== 'Reports') {
                        return (
                            <BinaryLink
                                id={item.id}
                                key={idx}
                                to={item?.link_to}
                                onClick={item?.onClick}
                                href={item?.href}
                                className='header__menu-link'
                                active_class='header__menu-link--active'
                            >
                                <React.Fragment>
                                    {item_text && (
                                        <Text
                                            size='m'
                                            line_height='xs'
                                            title={item_text}
                                            className='header__menu-link-text'
                                        >
                                            {item.icon}
                                            {item_text}
                                            {item.logo}
                                        </Text>
                                    )}
                                    {item.image && (
                                        <span className='header__menu-link-text'>
                                            {item.image}
                                            {item.logo}
                                        </span>
                                    )}
                                </React.Fragment>
                            </BinaryLink>
                        );
                    }

                    return null;
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
