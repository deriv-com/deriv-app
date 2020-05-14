import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PoiButton } from 'Components/poi-button/poi-button.jsx';
import IconMessageContent from 'Components/icon-message-content';
import { ContinueTradingButton } from 'Components/poa-continue-trading-button/continue-trading-button.jsx';

export const Verified = ({ needs_poi, is_description_disabled = false }) => {
    const message = localize('Your proof of address is verified');
    if (needs_poi) {
        return (
            <IconMessageContent
                message={message}
                text={localize('To continue trading, you must also submit a proof of identity.')}
                icon={<Icon icon='IcPoaVerified' size={128} />}
            >
                <PoiButton />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
            {!is_description_disabled && <ContinueTradingButton />}
        </IconMessageContent>
    );
};
