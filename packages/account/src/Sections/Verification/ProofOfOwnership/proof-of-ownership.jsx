import React from 'react';
import { Icon, Text } from '@deriv/components';

const Card = () => (
    <div className='proof-of-ownership'>
        <Icon icon='IcPoaFileEightMb' size={24} />
        <Text as='p' color='general' size={isMobile ? 'xs' : 's'} line_height='m' weight='bold'>
            {'Credit/debit card'}
        </Text>
    </div>
);
const ProofOfOwnership = is_virtual => {
    return (
        <div>
            <span>{is_virtual}</span>
            <Text size='xs'>Please upload the following document.</Text>
            <Card />
        </div>
    );
};

export default connect(({ client }) => ({
    is_virtual: client.is_virtual,
}))(ProofOfOwnership);
