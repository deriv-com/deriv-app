import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Icon } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { BinaryLink } from '../../Routes';
import { observer, useStore } from '@deriv/stores';
import { routes, startPerformanceEventTimer } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { useHistory } from 'react-router';
import './menu-links.scss';

const MenuItems = ({ id, text, icon, link_to, handleClickCashier }) => {
    return (
        <BinaryLink
            id={id}
            key={icon}
            to={link_to}
            className='header__menu-link'
            active_class='header__menu-link--active'
            onClick={handleClickCashier}
        >
            <Text size='m' line_height='xs' title={text} className='header__menu-link-text'>
                {icon}
                {text}
            </Text>
        </BinaryLink>
    );
};

const ReportTab = () => (
    <MenuItems
        id={'dt_reports_tab'}
        icon={<Icon icon='IcReports' className='header__icon' />}
        text={localize('Reports')}
        link_to={routes.reports}
    />
);

const CashierTab = observer(() => {
    const { client, ui } = useStore();
    const { has_any_real_account, is_virtual } = client;
    const { toggleReadyToDepositModal, toggleNeedRealAccountForCashierModal } = ui;
    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const history = useHistory();

    const toggle_modal_routes =
        window.location.pathname === routes.traders_hub || window.location.pathname === routes.bot;

    const toggleModal = () => {
        if (toggle_modal_routes && !has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (window.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            startPerformanceEventTimer('load_cashier_time');
            history.push(routes.cashier_deposit);
        }
    };

    const cashier_redirect =
        (toggle_modal_routes && !has_any_real_account && is_virtual) || real_account_needed_for_cashier;

    return (
        <MenuItems
            id={'dt_cashier_tab'}
            icon={
                <>
                    <Icon icon='IcCashier' className='header__icon' />
                </>
            }
            text={localize('Cashier')}
            link_to={!cashier_redirect ? routes.cashier : null}
            handleClickCashier={handleClickCashier}
        />
    );
});

const MenuLinks = observer(({ is_traders_hub_routes = false }) => {
    const { isDesktop } = useDevice();
    const { i18n } = useTranslation();
    const { client } = useStore();
    const { has_wallet, is_logged_in } = client;

    if (!is_logged_in) return <></>;

    return (
        <div key={`menu-links__${i18n.language}`} className='header__menu-links'>
            {!is_traders_hub_routes && <ReportTab />}
            {isDesktop && !has_wallet && <CashierTab />}
        </div>
    );
});

export { MenuLinks };
