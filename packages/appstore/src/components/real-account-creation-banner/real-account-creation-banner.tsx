import React from 'react';
import './real-account-creation-banner.scss';
import { getUrlBase, ContentFlag } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Text, Button } from '@deriv/components';
import { useStore } from '@deriv/stores';

const RealAccountCreationBanner = () => {
    const {
        ui: { is_mobile },
    } = useStore();
    const { client, traders_hub, ui } = useStore();
    const { real_account_creation_unlock_date } = client;
    const { setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { is_real, content_flag } = traders_hub;
    const eu_user = content_flag === ContentFlag.LOW_RISK_CR_EU || content_flag === ContentFlag.EU_REAL;
    return (
        <div className='real-account-creation-banner'>
            {is_mobile ? (
                <img src={getUrlBase('/public/images/common/real-account-banner-mobile.png')} />
            ) : (
                <img src={getUrlBase('/public/images/common/real-account-banner-desktop.png')} />
            )}

            <div className='real-account-creation-banner__content'>
                <Text size={is_mobile ? 'xs' : 'm'}>
                    <Localize i18n_default_text='Get a real account to deposit money and start trading.' />
                </Text>
                <Button
                    type='button'
                    onClick={() => {
                        if (is_real && eu_user) {
                            if (real_account_creation_unlock_date) {
                                setShouldShowCooldownModal(true);
                            } else {
                                openRealAccountSignup('maltainvest');
                            }
                        } else {
                            openRealAccountSignup('svg');
                        }
                    }}
                    primary
                >
                    <Localize i18n_default_text='Get real account' />
                </Button>
            </div>
        </div>
    );
};

export default RealAccountCreationBanner;
