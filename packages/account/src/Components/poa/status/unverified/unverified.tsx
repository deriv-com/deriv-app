import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from '../../../icon-message-content';

type TUnverified = {
    onClick: () => void;
};

export const Unverified = ({ onClick }: TUnverified) => {
    return (
        <IconMessageContent
            message={localize('We could not verify your proof of address')}
            text={localize('Please check your email for details.')}
            icon={<Icon icon='IcPoaError' size={128} />}
        >
            <Button onClick={onClick} has_effect primary>
                <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                    {localize('Resubmit')}
                </Text>
            </Button>
        </IconMessageContent>
    );
};
