import React from 'react';
import './mt5-mobile-download-option.scss';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';

const MT5MobileDownloadOption = () => {
    return (
        <div className='mt5-download-container'>
            {/* onClick:  mt5 web terminal (autofill login)  */}
            <div className='mt5-download-container--option'>
                <Icon icon='IcDesktop' size={16} />
                <Text as='p' align='left' size='xxs' weight='bold'>
                    <Localize i18n_default_text='MetaTrader5 web terminal' />
                </Text>
                <Icon icon='IcChevronRight' size={16} />
            </div>

            {/* onClick: have MT5 app ? mt5 app (autofill login) : download center (Playstore/ App Gallery / Appstore) */}
            <div className='mt5-download-container--option'>
                <Icon icon='IcMobile' size={16} />
                <Text as='p' align='left' size='xxs' weight='bold'>
                    <Localize i18n_default_text='Trade with MT5 mobile app' />
                </Text>
                <Icon icon='IcChevronRight' size={16} />
            </div>

            <Text as='p' size='xxxs'>
                <Localize
                    i18n_default_text="Note: Don't have the MT5 app? Tap the <0>Trade with MT5 mobile app</0> button to download. Once you have
                installed the app, return to this screen and hit the same button to log in."
                    components={[<strong key={0} />]}
                />
            </Text>

            <Text as='p' align='center' size='xxs'>
                <Localize
                    i18n_default_text='For MT5 login issues, visit our <0>Help Centre</0>.'
                    components={[<strong key={0} className='underlined' />]}
                />
            </Text>
        </div>
    );
};

export default MT5MobileDownloadOption;
