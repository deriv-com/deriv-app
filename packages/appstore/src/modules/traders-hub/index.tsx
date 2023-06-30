import React from 'react';
import classNames from 'classnames';
import { isDesktop } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { Div100vhContainer } from '@deriv/components';
import TourGuide from 'Modules/tour-guide/tour-guide';
import ModalManager from 'Components/modals/modal-manager';
import EUDisclaimer from 'Components/eu-disclaimer';
import AccountWithWallets from './account-with-wallets';
import AccountWithoutWallets from './account-without-wallets';
import WalletTourGuide from 'Modules/tour-guide/wallet-tour-guide';
import { useContentFlag } from '@deriv/hooks';
import './traders-hub.scss';

const TradersHub = () => {
    const { traders_hub, client, ui } = useStore();
    const { notification_messages_ui: Notifications } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        accounts,
    } = client;
    const { is_tour_open, is_eu_user, is_wallet_tour_open, toggleIsWalletTourOpen } = traders_hub;
    const traders_hub_ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const can_show_notify =
        !is_switching &&
        !is_logging_in &&
        is_account_setting_loaded &&
        is_landing_company_loaded &&
        Notifications !== null;

    const [scrolled, setScrolled] = React.useState(false);

    const handleScroll = () => {
        const element = traders_hub_ref?.current;
        if (element && is_tour_open) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    React.useEffect(() => {
        setTimeout(() => {
            handleScroll();
            setTimeout(() => {
                setScrolled(true);
            }, 200);
        }, 100);
    }, [is_tour_open, is_wallet_tour_open]);

    const { is_low_risk_cr_eu, is_high_risk_cr } = useContentFlag();

    if (!is_logged_in) return null;

    // TODO: change it when 'wallet' property will be in authorize response
    const is_wallet_account = Object.keys(accounts).some(key => accounts[key]?.account_category === 'wallet');

    return (
        <React.Fragment>
            <Div100vhContainer
                className={classNames('traders-hub--mobile', {
                    'traders-hub--mobile--eu-user': is_eu_user,
                    'traders-hub__wallets-bg': is_wallet_account || is_display_test_wallets,
                })}
                height_offset='50px'
                is_disabled={isDesktop()}
            >
                {can_show_notify && <Notifications />}
                <div id='traders-hub' className='traders-hub' ref={traders_hub_ref}>
                    <button onClick={() => toggleIsWalletTourOpen()}>Open Tour</button>
                    {is_wallet_tour_open && <WalletTourGuide />}
                    {is_high_risk_cr && <AccountWithWallets />}
                    <AccountWithoutWallets />
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_low_risk_cr_eu && <EUDisclaimer />}
        </React.Fragment>
    );
};

export default observer(TradersHub);
