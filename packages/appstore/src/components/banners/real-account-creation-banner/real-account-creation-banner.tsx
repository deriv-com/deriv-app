import React, { useEffect } from 'react';

import { Button, Text } from '@deriv/components';
import { cacheTrackEvents, getUrlBase, Jurisdiction } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';

import './real-account-creation-banner.scss';

const RealAccountCreationBanner = observer(() => {
    const { isDesktop, isMobile } = useDevice();
    const { ui } = useStore();
    const { openRealAccountSignup, is_dark_mode_on } = ui;
    const device = isMobile ? 'mobile' : 'desktop';

    const handleClick = () => {
        cacheTrackEvents.loadEvent([
            {
                event: {
                    name: 'ce_tradershub_banner',
                    properties: {
                        action: 'click_cta',
                        banner_name: 'real_account_cta',
                        banner_type: 'with_cta',
                    },
                },
            },
        ]);
        openRealAccountSignup(Jurisdiction.SVG);
    };

    useEffect(() => {
        cacheTrackEvents.loadEvent([
            {
                event: {
                    name: 'ce_tradershub_banner',
                    properties: {
                        action: 'open',
                        banner_name: 'real_account_cta',
                        banner_type: 'with_cta',
                    },
                },
            },
        ]);
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
                <Text size={!isDesktop ? 'xs' : 'm'}>
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
