import React from 'react';
import ModalManager from 'Components/modals/modal-manager';
import TourGuide from 'Modules/tour-guide/tour-guide';
import { isDesktop, ContentFlag, isMobile } from '@deriv/shared';
import { Div100vhContainer, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import classNames from 'classnames';
import AccountWithWallets from './account-with-wallets';
import AccountWithoutWallets from './account-without-wallets';
import { useStore, observer } from '@deriv/stores';
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
    const { is_tour_open, content_flag, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const can_show_notify =
        !is_switching &&
        !is_logging_in &&
        is_account_setting_loaded &&
        is_landing_company_loaded &&
        Notifications !== null;

    const [scrolled, setScrolled] = React.useState(false);
    // TODO: delete later. Just for testing purpose
    const [is_display_test_wallets, setIsDisplayTestWallets] = React.useState(0);

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

    const is_eu_low_risk = content_flag === ContentFlag.LOW_RISK_CR_EU;

    if (!is_logged_in) return null;

    const EUDisclaimer = () => {
        return (
            <div className='disclaimer'>
                <Text align='left' className='disclaimer-text' size={isMobile() ? 'xxxs' : 'xs'}>
                    <Localize
                        i18n_default_text='<0>EU statutory disclaimer</0>: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>71% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
                        components={[<strong key={0} />]}
                    />
                </Text>
            </div>
        );
    };

    // TODO: delete after testing
    const SelectJSX = (
        <div>
            <select
                onChange={event => {
                    if (Number(event.target.value) === 0) setIsDisplayTestWallets(0);
                    else setIsDisplayTestWallets(1);
                }}
            >
                <option value={0}>Hide test wallets</option>
                <option value={1}>Show test wallets</option>
            </select>
        </div>
    );

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
                    {SelectJSX}
                    {!!is_display_test_wallets && <AccountWithWallets show_test_wallets={!!is_display_test_wallets} />}
                    {is_wallet_account ? <AccountWithWallets /> : <AccountWithoutWallets />}
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_eu_low_risk && <EUDisclaimer />}
        </React.Fragment>
    );
};

export default observer(TradersHub);
