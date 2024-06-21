import React, { useEffect } from 'react';
import './real-account-creation-banner.scss';
import { getUrlBase, Jurisdiction } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import { Localize } from '@deriv/translations';
import { Text, Button } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';

const RealAccountCreationBanner = observer(() => {
    const {
        ui: { is_mobile },
    } = useStore();

    const { ui } = useStore();
    const { openRealAccountSignup, is_dark_mode_on } = ui;
    const device = is_mobile ? 'mobile' : 'desktop';

    const handleClick = () => {
        Analytics.trackEvent('ce_tradershub_banner', {
            action: 'click_cta',
            banner_name: 'real_account_cta',
            banner_type: 'with_cta',
        });
        openRealAccountSignup(Jurisdiction.SVG);
    };

    useEffect(() => {
        Analytics.trackEvent('ce_tradershub_banner', {
            action: 'open',
            banner_name: 'real_account_cta',
            banner_type: 'with_cta',
        });
    }, []);

    return (
        <div className='real-account-creation-banner'>
            <img
                alt='Deriv real account banner'
                src={getUrlBase(
                    `/public/images/common/real-account-banner-${device}-${is_dark_mode_on ? 'dark' : 'light'}.svg`
                )}
            />

            <div className='real-account-creation-banner__content'>
                <Text size={is_mobile ? 'xs' : 'm'}>
                    <Localize i18n_default_text='Get a real account to deposit money and start trading.' />
                </Text>
                <Button type='button' onClick={handleClick} primary>
                    <Localize i18n_default_text='Get real account' />
                </Button>
            </div>
        </div>
    );
});

export default RealAccountCreationBanner;
