import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const Card = () => (
    <div className='proof-of-ownership__card'>
        <Icon icon='IcCreditCard' className='proof-of-ownership__card-logo' width={64} height={58} />
        <Text className='proof-of-ownership__card-text' weight='bold' as='p' color='general' size='s' line_height='m' weight='bold'>
            {'Credit/debit card'}
        </Text>
        <Icon icon='IcChevronDownBold' className='proof-of-ownership__card-icon' />
    </div>
);
const ProofOfOwnership = () => {
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
