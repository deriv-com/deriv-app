import { Button, Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

export const POORejetced = ({ onTryAgain }) => {
    return (
        <div className='proof-of-ownership__container'>
            <div className='proof-of-ownership__container--content'>
                <Icon className='icon' icon='IcPooRejected' size={128} />
                <Text weight='bold'>{localize('Proof of ownership verification failed')}</Text>
                <Text size='xs'>{localize('We were unable to verify your proof of ownership.')}</Text>
                <Button
                    type='button'
                    className='proof-of-ownership__try-again-button'
                    onClick={onTryAgain}
                    large
                    text={localize('Try again')}
                    primary
                    data-testid='dt_try-again-button'
                />
            </div>
        </div>
    );
};
