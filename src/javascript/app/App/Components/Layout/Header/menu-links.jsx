import PropTypes      from 'prop-types';
import React          from 'react';
import Symbol         from 'Images/app/header/symbol.svg';
import { BinaryLink } from '../../Routes';

const MenuLinks = ({ is_logged_in, items }) => (
    <React.Fragment>
        <div className='header__navbar-icons header__navbar-icons--deriv-logo'>
            <Symbol width='30px' height='30px' />
        </div>
        {!!items.length &&
        <div className='header__menu-links'>
            {
                items.map((item, idx) => (
                    (item.login_only && (item.login_only !== is_logged_in)) ?
                        null
                        :
                        <BinaryLink key={idx} to={item.link_to} className='header__menu-link' active_class='header__menu-link--active'>
                            <span title={item.text} className='header__menu-link-text'>{item.icon}{item.text}{item.logo}</span>
                        </BinaryLink>
                ))
            }
        </div>
        }
    </React.Fragment>
);

MenuLinks.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.shape({
            className: PropTypes.string,
        }),
        is_logged_in: PropTypes.bool,
        link_to     : PropTypes.string,
        text        : PropTypes.string,
    })),
};

export { MenuLinks };
