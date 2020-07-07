import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import ContinueTradingButton from 'Components/poa-continue-trading-button';
import PoaButton from 'Components/poa-button';
import RedirectButton from 'Components/redirect-button';
import IconMessageContent from 'Components/icon-message-content';

export const Verified = ({ has_poa, is_description_enabled, show_redirect_btn, routeBackInApp }) => {
    const message = localize('Your proof of identity is verified');
    if (has_poa) {
        return (
            <IconMessageContent message={message} icon={<Icon icon='IcPoiVerified' size={128} />}>
                {is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            icon={<Icon icon='IcPoiVerified' size={128} />}
            text={localize('To continue trading, you must also submit a proof of address.')}
        >
            {is_description_enabled && <PoaButton />}
            {show_redirect_btn && <RedirectButton onClick={routeBackInApp} />}
        </IconMessageContent>
    );
};
