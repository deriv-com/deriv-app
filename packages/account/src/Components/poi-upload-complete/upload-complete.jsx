import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import ContinueTradingButton from 'Components/poa-continue-trading-button';
import PoaButton from 'Components/poa-button';
import IconMessageContent from 'Components/icon-message-content';

export const UploadComplete = ({ has_poa, is_description_enabled, redirect_button }) => {
    const message = localize('Your proof of identity was submitted successfully');
    if (has_poa) {
        return (
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<Icon icon='IcPoiVerified' size={128} />}
            >
                {is_description_enabled && <ContinueTradingButton />}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent message={message} icon={<Icon icon='IcPoiVerified' size={128} />}>
            {is_description_enabled && (
                <React.Fragment>
                    <div className='account-management__text-container'>
                        <p className='account-management__text'>
                            {localize('Your document is being reviewed, please check back in 1-3 days.')}
                        </p>
                        <p className='account-management__text'>
                            {localize('You must also submit a proof of address.')}
                        </p>
                    </div>
                    <PoaButton />
                </React.Fragment>
            )}
            {redirect_button}
        </IconMessageContent>
    );
};
