import React from 'react';

import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

import { getDeeplinkUrl, getMobileAppInstallerUrl, getWebtraderUrl } from '../Helpers/constants';

import './mt5-mobile-redirect-option.scss';

const MT5MobileRedirectOption = ({ mt5_trade_account }: { mt5_trade_account: DetailsOfEachMT5Loginid }) => {
    const mobileURLSet = async () => {
        window.location.replace(getDeeplinkUrl({ mt5_trade_account }));
        const mobileAppURL = await getMobileAppInstallerUrl({ mt5_trade_account });

        const timeout = setTimeout(() => {
            mobileAppURL && window.location.replace(mobileAppURL);
        }, 1000);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                clearTimeout(timeout);
            }

            // iOS (17+) and certain browsers (edge) may have popups before redirecting
            if (window.onblur) {
                clearTimeout(timeout); // installer wont open but will redirect to MetaTrader5
                if (!document.hidden) {
                    mobileAppURL && window.location.replace(mobileAppURL); // if it is not redirecting then open installer
                }
            }
        });
    };

    return (
        <div className='mt5-download-container'>
            <a
                className='mt5-download-container--option'
                href={getWebtraderUrl({ mt5_trade_account })}
                target='_blank'
                rel='noopener noreferrer'
            >
                <div className='full-row'>
                    <Icon icon='IcDesktopOutline' size={16} />
                    <Text align='left' size='xxs' weight='bold' className='title'>
                        <Localize i18n_default_text={'MetaTrader5 web terminal'} />
                    </Text>
                    <Icon icon='IcChevronRight' size={16} />
                </div>
            </a>
            <button className='mt5-download-container--option blue' onClick={mobileURLSet}>
                <div className='full-row'>
                    <Icon icon='IcMobileOutline' size={16} />
                    <Text align='left' size='xxs' weight='bold' className='title'>
                        <Localize i18n_default_text={'Trade with MT5 mobile app'} />
                    </Text>
                    <Icon icon='IcChevronRightLight' size={16} />
                </div>
            </button>

            <Text as='p' size='xxxxs'>
                <Localize
                    i18n_default_text="Note: Don't have the MT5 app? Tap the <0>Trade with MT5 mobile app</0> button to download. Once you have
                installed the app, return to this screen and hit the same button to log in."
                    components={[<strong key={0} />]}
                />
            </Text>
        </div>
    );
};

export default MT5MobileRedirectOption;
