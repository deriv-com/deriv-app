import React from 'react';
import { PlatformContext } from '@deriv/shared';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

export const Unverified = ({ onClick }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    return (
        <IconMessageContent
            message={localize('We could not verify your proof of address')}
            text={localize('Please check your email for details.')}
            icon={<Icon icon={is_appstore ? 'IcPoaErrorDashboard' : 'IcPoaError'} size={128} />}
        >
            <Button onClick={onClick} has_effect primary>
                <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                    {localize('Resubmit')}
                </Text>
            </Button>
        </IconMessageContent>
    );
};
