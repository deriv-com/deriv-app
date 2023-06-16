import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { isMobile, routes, getStaticUrl } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { BinaryLink } from 'App/Components/Routes';

type TMenuLink = {
    link_to: string;
    icon: string;
    is_active: boolean;
    is_disabled: boolean;
    suffix_icon: string;
    text: string;
    onClickLink: () => void;
    is_hidden: boolean;
};

const MenuLink = observer(
    ({
        link_to,
        icon = '',
        is_active,
        is_disabled,
        suffix_icon = '',
        text,
        onClickLink,
        is_hidden,
    }: Partial<TMenuLink>) => {
        const { common, ui, client } = useStore();
        const { setMobileLanguageMenuOpen } = common;
        const deriv_static_url = getStaticUrl(link_to);
        const history = useHistory();
        const { has_any_real_account, is_virtual } = client;
        const { toggleReadyToDepositModal, toggleNeedRealAccountForCashierModal } = ui;
        const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

        const cashier_link =
            link_to === routes.cashier_deposit ||
            link_to === routes.cashier_withdrawal ||
            link_to === routes.cashier_acc_transfer;

        if (is_hidden) return null;

        const traders_hub_path = window.location.pathname === routes.traders_hub;

        if (isMobile() && link_to === routes.languages) {
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    onClick={() => setMobileLanguageMenuOpen(true)}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        }

        if (real_account_needed_for_cashier && cashier_link && traders_hub_path) {
            const handleClickCashier = () => {
                onClickLink?.();
                toggleNeedRealAccountForCashierModal();
            };
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    onClick={handleClickCashier}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        }

        if (cashier_link && is_virtual && !has_any_real_account) {
            const toggle_modal_routes =
                window.location.pathname === routes.root || window.location.pathname === routes.traders_hub;

            const toggleModal = () => {
                if (toggle_modal_routes && !has_any_real_account) {
                    toggleReadyToDepositModal();
                }
            };

            const handleClickCashier = () => {
                if (is_virtual && has_any_real_account) {
                    history.push(routes.cashier_deposit);
                } else if (!has_any_real_account && is_virtual) {
                    toggleModal();
                }
                onClickLink?.();
            };
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                    onClick={handleClickCashier}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        }

        if (!link_to) {
            return (
                <div
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                    })}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <span className='header__menu-mobile-link-text'>{text}</span>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </div>
            );
        } else if (deriv_static_url) {
            return (
                <NavLink
                    className={classNames('header__menu-mobile-link', {
                        'header__menu-mobile-link--disabled': is_disabled,
                        'header__menu-mobile-link--active': is_active,
                    })}
                    to={link_to}
                    onClick={onClickLink}
                >
                    <Icon className='header__menu-mobile-link-icon' icon={icon} />
                    <Text
                        className={text === localize('Trade') ? '' : 'header__menu-mobile-link-text'}
                        as='h3'
                        size='xs'
                        weight={window.location.pathname === '/' && text === localize('Trade') ? 'bold' : undefined}
                    >
                        {text}
                    </Text>
                    {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
                </NavLink>
            );
        }

        return (
            <BinaryLink
                to={link_to}
                className={classNames('header__menu-mobile-link', {
                    'header__menu-mobile-link--disabled': is_disabled,
                    'header__menu-mobile-link--active': is_active,
                })}
                active_class='header__menu-mobile-link--active'
                onClick={onClickLink}
            >
                <Icon className='header__menu-mobile-link-icon' icon={icon} />
                <Text
                    className={text === localize('Trade') ? '' : 'header__menu-mobile-link-text'}
                    as='h3'
                    size='xs'
                    weight={window.location.pathname === '/' && text === localize('Trade') ? 'bold' : undefined}
                >
                    {text}
                </Text>
                {suffix_icon && <Icon className='header__menu-mobile-link-suffix-icon' icon={suffix_icon} />}
            </BinaryLink>
        );
    }
);

export { MenuLink };
