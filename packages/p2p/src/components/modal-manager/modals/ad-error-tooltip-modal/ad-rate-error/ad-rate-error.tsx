import React from 'react';
import { useP2PSettings } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { ad_type } from 'Constants/floating-rate';

const AdRateError = () => {
    const {
        client: { local_currency_config },
    } = useStore();

    const { p2p_settings } = useP2PSettings();

    if (p2p_settings?.rate_type === ad_type.FLOAT) {
        return p2p_settings.reached_target_date || !p2p_settings.fixed_rate_adverts_end_date ? (
            <Localize i18n_default_text='Your ads with fixed rates have been deactivated. Set floating rates to reactivate them.' />
        ) : (
            <Localize
                i18n_default_text={
                    'Floating rates are enabled for {{local_currency}}. Ads with fixed rates will be deactivated. Switch to floating rates by {{end_date}}.'
                }
                values={{
                    local_currency: local_currency_config.currency || '',
                    end_date: p2p_settings?.fixed_rate_adverts_end_date || '',
                }}
            />
        );
    }

    return (
        <Localize i18n_default_text='Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.' />
    );
};

export default AdRateError;
