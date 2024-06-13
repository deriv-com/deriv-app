import React, { ReactNode } from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from '../../../icon-message-content';

type TUnverified = {
    title?: ReactNode;
    description?: ReactNode;
    onClick: () => void;
    button_text?: ReactNode;
};

export const Unverified = ({ title, description, button_text, onClick }: TUnverified) => {
    return (
        <IconMessageContent
            message={title ?? localize('We could not verify your proof of address')}
            text={description ?? localize('Please check your email for details.')}
            icon={<Icon icon='IcPoaError' size={128} />}
        >
            <Button onClick={onClick} has_effect primary>
                <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                    {button_text ?? localize('Resubmit')}
                </Text>
            </Button>
        </IconMessageContent>
    );
};
