import React from 'react';
import classNames from 'classnames';
import { isDesktop } from '@deriv/shared';
import { Div100vhContainer } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { useContentFlag } from '@deriv/hooks';
import ModalManager from 'Components/modals/modal-manager';
import TourGuide from 'Modules/tour-guide/tour-guide';
import AccountWithWallets from './account-with-wallets';
import AccountWithoutWallets from './account-without-wallets';
import EUDisclaimer from 'Components/eu-disclaimer';
import AddMoreWallets from 'Components/add-more-wallets';
import './traders-hub.scss';

const TradersHub = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { notification_messages_ui: Notifications } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        accounts,
        loginid,
    } = client;
    const { is_tour_open, is_eu_user } = traders_hub;
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
    }, [is_tour_open]);

    const { is_low_risk_cr_eu } = useContentFlag();

    if (!is_logged_in) return null;

    // TODO: change it when 'wallet' property will be in authorize response
    const is_wallet_account = Object.keys(accounts).some(key => accounts[key]?.account_category === 'wallet');

    return (
        <React.Fragment>
            <Div100vhContainer
                className={classNames('traders-hub--mobile', {
                    'traders-hub--mobile--eu-user': is_eu_user,
                    'traders-hub__wallets-bg': is_wallet_account,
                })}
                height_offset='50px'
                is_disabled={isDesktop()}
            >
                {can_show_notify && <Notifications />}
                <div
                    id='traders-hub'
                    ref={traders_hub_ref}
                    className={classNames('traders-hub', {
                        'traders-hub__wallets': is_wallet_account,
                        'traders-hub__wallets-demo-bg': is_wallet_account && loginid && accounts?.[loginid]?.is_virtual,
                    })}
                >
                    {is_wallet_account ? <AccountWithWallets /> : <AccountWithoutWallets />}
                    <AddMoreWallets />
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_low_risk_cr_eu && <EUDisclaimer />}
        </React.Fragment>
    );
});

export default TradersHub;
