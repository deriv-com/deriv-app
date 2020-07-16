import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import ContinueTradingButton from 'Components/poa-continue-trading-button';
import PoaButton from 'Components/poa-button';
import IconMessageContent from 'Components/icon-message-content';

export const Verified = ({ has_poa, is_description_enabled, redirect_button }) => {
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
            {redirect_button}
        </IconMessageContent>
    );
};
