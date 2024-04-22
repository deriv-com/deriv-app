import React from 'react';
import './real-account-creation-banner.scss';
import { getUrlBase, Jurisdiction } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Text, Button } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useContentFlag } from '@deriv/hooks';

const RealAccountCreationBanner = observer(() => {
    const {
        ui: { is_mobile },
    } = useStore();

    const { client, traders_hub, ui } = useStore();
    const { real_account_creation_unlock_date } = client;
    const { setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { is_real } = traders_hub;
    const { is_eu_real, is_low_risk_cr_eu } = useContentFlag();
    const eu_user = is_eu_real || is_low_risk_cr_eu;
    const device = is_mobile ? 'mobile' : 'desktop';

    const handleClick = () => {
        if (is_real && eu_user) {
            if (real_account_creation_unlock_date) {
                setShouldShowCooldownModal(true);
            } else {
                openRealAccountSignup(Jurisdiction.MALTA_INVEST);
            }
        } else {
            openRealAccountSignup(Jurisdiction.SVG);
        }
    };

    return (
        <div className='real-account-creation-banner'>
            <img
                alt='Deriv real account banner'
                src={getUrlBase(`/public/images/common/real-account-banner-${device}.png`)}
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
