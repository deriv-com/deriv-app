import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import { ContinueTradingButton } from 'Components/poa-continue-trading-button/continue-trading-button.jsx';
import PoiButton from 'Components/poi-button';
import IconMessageContent from 'Components/icon-message-content';

export const Submitted = ({ needs_poi, is_description_disabled = false }) => {
    const message = localize('Your proof of address was submitted successfully');
    if (needs_poi) {
        return (
            <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
                <div className='account-management__text-container'>
                    <p className='account-management__text'>
                        {localize('Your document is being reviewed, please check back in 1-3 days.')}
                    </p>
                    <p className='account-management__text'>{localize('You must also submit a proof of identity.')}</p>
                </div>
                <PoiButton />
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent
            message={message}
            text={localize('Your document is being reviewed, please check back in 1-3 days.')}
            icon={<Icon icon='IcPoaVerified' size={128} />}
        >
            {!is_description_disabled && <ContinueTradingButton />}
        </IconMessageContent>
    );
};
