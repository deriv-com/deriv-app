import React from 'react';
import { Text } from '@deriv-com/ui';
import './JurisdictionCardTag.scss';

type TJurisdictionCardTagProps = {
    tag: string;
};

const JurisdictionCardTag: React.FC<TJurisdictionCardTagProps> = ({ tag }) => {
    return (
        <div className='wallets-jurisdiction-card-tag'>
            <Text align='center' color='blue' lineHeight='3xs' size='xs' weight='bold'>
                {tag}
            </Text>
        </div>
    );
};

export default JurisdictionCardTag;
