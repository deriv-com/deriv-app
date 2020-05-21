import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from 'Components/icon-message-content';
import { ContinueTradingButton } from 'Components/poa-continue-trading-button/continue-trading-button.jsx';

export const NeedsReview = ({ is_description_disabled = false }) => (
    <IconMessageContent
        message={localize('Your proof of address was submitted successfully')}
        text={localize('Your document is being reviewed, please check back in 1-3 days.')}
        icon={<Icon icon='IcPoaVerified' size={128} />}
    >
        {!is_description_disabled && <ContinueTradingButton />}
    </IconMessageContent>
);
