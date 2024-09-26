import React, { FC } from 'react';
import {
    LabelPairedChevronRightLgFillIcon,
    LegacyMonitorIcon,
    StandaloneMobileNotchRegularIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../../../../types';
import { getDeeplinkUrl, getMobileAppInstallerUrl, getWebtraderUrl } from './constants';
import './MT5MobileRedirectOption.scss';

type TMT5MobileRedirectOptionProps = {
    mt5TradeAccount: THooks.MT5AccountsList;
};

const MT5MobileRedirectOption: FC<TMT5MobileRedirectOptionProps> = ({ mt5TradeAccount }) => {
    const mobileURLSet = async () => {
        window.location.replace(getDeeplinkUrl({ mt5TradeAccount }));
        const mobileAppURL = await getMobileAppInstallerUrl({ mt5TradeAccount });

        const timeout = setTimeout(() => {
            mobileAppURL && window.location.replace(mobileAppURL);
        }, 3000);

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
        <div className='wallets-mobile-redirect-option'>
            <a
                className='wallets-mobile-redirect-option__button'
                href={getWebtraderUrl({ mt5TradeAccount })}
                rel='noopener noreferrer'
                target='_blank'
            >
                <LegacyMonitorIcon iconSize='sm' />
                <div className='wallets-mobile-redirect-option__button__content'>
                    <Text align='left' size='xs' weight='bold'>
                        <Localize i18n_default_text='MetaTrader5 web terminal' />
                    </Text>
                </div>
                <LabelPairedChevronRightLgFillIcon />
            </a>
            <button
                className='wallets-mobile-redirect-option__button wallets-mobile-redirect-option__button--blue'
                onClick={mobileURLSet}
            >
                <StandaloneMobileNotchRegularIcon fill='#FFF' />
                <div className='wallets-mobile-redirect-option__button__content'>
                    <Text align='left' color='white' size='xs' weight='bold'>
                        <Localize i18n_default_text='Trade with MT5 mobile app' />
                    </Text>
                </div>
                <LabelPairedChevronRightLgFillIcon fill='#FFF' />
            </button>
            <Text as='p' size='xs'>
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text="Note: Don't have the MT5 app? Tap the <0>Trade with MT5 mobile app</0> button to download. Once you have installed the app, return to this screen and hit the same button to log in."
                />
            </Text>
        </div>
    );
};

export default MT5MobileRedirectOption;
