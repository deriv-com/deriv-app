import React from 'react';
import { Text } from '@deriv/components';
import { BinaryLink } from '../../Routes';

type MenuLinksProps = {
    items: unknown;
};

const MenuLinks = ({ is_logged_in, items }: MenuLinksProps) => (
    <React.Fragment>
        {!!items.length && (
            <div className='header__menu-links'>
                {items.map((item, idx) =>
                    item.login_only && item.login_only !== is_logged_in ? null : (
                        <BinaryLink
                            id={item.id}
                            key={idx}
                            to={item.link_to || undefined}
                            onClick={item.onClick || undefined}
                            href={item.href || undefined}
                            className='header__menu-link'
                            active_class='header__menu-link--active'
                        >
                            <React.Fragment>
                                {item.text && (
                                    <Text
                                        size='m'
                                        line_height='xs'
                                        title={item.text()}
                                        className='header__menu-link-text'
                                    >
                                        {item.icon}
                                        {item.text()}
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
                    )
                )}
            </div>
        )}
    </React.Fragment>
);

export { MenuLinks };
