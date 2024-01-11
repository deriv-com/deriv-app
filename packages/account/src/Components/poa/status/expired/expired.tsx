import { Button, Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';
import IconMessageContent from '../../../icon-message-content';

type TExpired = {
    onClick: () => void;
};

export const Expired = ({ onClick }: TExpired) => (
    <div className='account-management__container'>
        <IconMessageContent
            message={localize('New proof of address is needed')}
            text={
                <Localize
                    i18n_default_text='Your document for proof of address is expired. <0/>Please submit again.'
                    components={[<br key={0} />]}
                />
            }
            icon={<Icon icon='IcPoaUpload' size={128} />}
        >
            <Button onClick={onClick} has_effect primary>
                <Text className='dc-btn__text' size='xs' weight='bold' as='p'>
                    {localize('Resubmit')}
                </Text>
            </Button>
        </IconMessageContent>
    </div>
);
