import { Icon, Text } from '@deriv/components';

import { ContinueTradingButton } from 'Components/poa/continue-trading-button/continue-trading-button';
import IconMessageContent from 'Components/icon-message-content';
import PoiButton from 'Components/poi/poi-button';
import React from 'react';
import { TPoaStatusProps } from 'Types';
import { localize } from '@deriv/translations';
import { isNavigationFromP2P, isNavigationFromDerivGO } from '@deriv/shared';

export const NeedsReview = ({ needs_poi, redirect_button }: TPoaStatusProps) => {
    const message = localize('Your proof of address was submitted successfully');
    const is_redirected_from_platform = isNavigationFromP2P() || isNavigationFromDerivGO();
    if (!needs_poi) {
        return (
            <IconMessageContent
                message={message}
                text={localize('Your document is being reviewed, please check back in 1-3 days.')}
                icon={<Icon icon='IcPoaVerified' size={128} />}
            >
                {redirect_button || (!is_redirected_from_platform && <ContinueTradingButton />)}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent message={message} icon={<Icon icon='IcPoaVerified' size={128} />}>
            <div className='account-management__text-container'>
                <Text align='center' size='xs' as='p'>
                    {localize('Your document is being reviewed, please check back in 1-3 days.')}
                </Text>
                <Text align='center' size='xs' as='p'>
                    {localize('You must also submit a proof of identity.')}
                </Text>
            </div>
            <PoiButton />
        </IconMessageContent>
    );
};
