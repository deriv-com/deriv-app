import * as React from 'react';
import { AppSettings, Popup } from '@deriv/components';
import { localize } from '@deriv/translations';
import { AccountLimits, ApiToken, SelfExclusion } from 'App/Components/Elements/AppSettings';
import { connect } from 'Stores/connect';

const TempAppSettings = ({ balance, currency }) => {
    const [is_open, setIsOpen] = React.useState(false);

    // Naturally, this is temp. TODO: Incorporate with app-specific header.
    React.useEffect(() => {
        window.toggleTempAppSettings = () => setIsOpen(!is_open);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const menu_items = [
        {
            key: 'trading_limits',
            title: localize('Trading limits'),
            component: SelfExclusion,
        },
        {
            key: 'account_limits',
            title: localize('Account limits'),
            component: AccountLimits,
        },
        {
            key: 'api_token',
            title: localize('API Token'),
            component: ApiToken,
        },
    ];

    const togglePopup = () => setIsOpen(!is_open);

    return (
        <React.Fragment>
            <Popup
                active_tab_icon_color='var(--text-general)'
                balance={parseFloat(balance)}
                close_icon_color='var(--text-general)'
                Component={({ overlay_ref, setIsOverlayShown }) => (
                    <AppSettings
                        menu_items={menu_items}
                        overlay_ref={overlay_ref}
                        setIsOverlayShown={setIsOverlayShown}
                    />
                )}
                currency={currency}
                header_background_color='var(--general-section-1)'
                header_big_text={localize('Settings')}
                header_contents_color='var(--text-general)'
                header_icon='IcBrandDerivApps' // TODO: Update to actual app icon.
                onHeaderButtonClick={togglePopup}
                should_show_popup={is_open}
                title='Deriv Apps USD' // TODO: Update to actual app name.
                togglePopupModal={togglePopup}
            />
        </React.Fragment>
    );
};

export default connect(({ client }) => ({
    balance: client.balance,
    currency: client.currency,
}))(TempAppSettings);
