import classNames from 'classnames';
import React, { useState } from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import ExpandedCard from './ExpandedCard';

const ProofOfOwnership = () => {
    const [is_open, setIsOpen] = useState(false);

    const onClick = () => setIsOpen(!is_open);
    const icon = (
        <Icon
            icon={'IcChevronUpBold'}
            color='black'
            size={16}
            className={classNames('proof-of-ownership__card-item-icon', {
                'proof-of-ownership__card-item-icon--invert': !is_open,
            })}
        />
    );
    const Card = () => (
        <div className={classNames('proof-of-ownership__card', { 'proof-of-ownership__card-open': is_open })}>
            <div className='proof-of-ownership__card-item'>
                <Icon icon='IcCreditCard' className='proof-of-ownership__card-item-logo' width={64} height={58} />
                <Text className='proof-of-ownership__card-item-text' as='p' color='general' size='s' weight='bold'>
                    {localize('Credit/debit card')}
                </Text>
                <Button
                    id='proof-of-ownership'
                    icon={icon}
                    className='proof-of-ownership__card-item-icon'
                    onClick={onClick}
                    transparent
                    data-testid={'proof-of-ownership-button'}
                />
            </div>
            {is_open && <ExpandedCard />}
        </div>
    );

    return (
        <div className='proof-of-identity'>
            <Text size='xs' as='p'>
                {localize('Please upload the following document.')}
            </Text>
            <Card />
        </div>
    );
};

export default ProofOfOwnership;
