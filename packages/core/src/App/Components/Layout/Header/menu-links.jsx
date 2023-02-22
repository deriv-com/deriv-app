import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import { BinaryLink } from '../../Routes';
import { routes } from '@deriv/shared';
import { useHistory } from 'react-router';

const MenuItems = ({
    item,
    hide_menu_item,
    toggleReadyToDepositModal,
    has_any_real_account,
    is_virtual,
    switchAccount,
    account_list,
}) => {
    const history = useHistory();

    const { id, link_to, href, text, image, logo, icon } = item;

    const cashier_item = text() === 'Cashier';
    const toggle_modal_routes =
        window.location.pathname === routes.root || window.location.pathname === routes.traders_hub;

    const toggleModal = () => {
        if (cashier_item && toggle_modal_routes && !has_any_real_account) {
            toggleReadyToDepositModal();
        }
    };
    const test = account_list?.find(acc => acc.loginid?.[0]).loginid;

    const switchToRealAccount = () => {
        if (is_virtual) {
            switchAccount(test);
        }
        history.push(routes.cashier_deposit);
    };

    const asd = () => {
        if (is_virtual) {
            switchToRealAccount();
        } else if (!has_any_real_account && is_virtual) {
            toggleModal();
        }
    };

    return hide_menu_item ? null : (
        <BinaryLink
            id={id}
            key={icon}
            to={link_to}
            href={href}
            className='header__menu-link'
            active_class='header__menu-link--active'
            onClick={asd}
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

const MenuLinks = ({
    is_logged_in,
    is_mobile,
    items,
    is_pre_appstore,
    toggleReadyToDepositModal,
    has_any_real_account,
    is_virtual,
    account_list,
    switchAccount,
}) => (
    <React.Fragment>
        {!!items.length && (
            <div className='header__menu-links'>
                {items.map(item => {
                    const cashier_item = item?.link_to?.toLowerCase() === '/cashier';
                    const reports_item = item?.link_to?.toLowerCase() === '/reports';

                    return (
                        is_logged_in && (
                            <MenuItems
                                key={`${item.icon}${item.id}`}
                                item={item}
                                hide_menu_item={is_pre_appstore && (reports_item || (cashier_item && is_mobile))}
                                toggleReadyToDepositModal={toggleReadyToDepositModal}
                                has_any_real_account={has_any_real_account}
                                is_virtual={is_virtual}
                                account_list={account_list}
                                switchAccount={switchAccount}
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
    toggleReadyToDepositModal: PropTypes.func,
    has_any_real_account: PropTypes.bool,
    is_virtual: PropTypes.bool,
    account_list: PropTypes.array,
    switchAccount: PropTypes.func,
};

export { MenuLinks };
