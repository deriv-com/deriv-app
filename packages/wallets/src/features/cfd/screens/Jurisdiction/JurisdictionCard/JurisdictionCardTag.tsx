import React from 'react';
import { WalletText } from '../../../../../components/Base';
import './JurisdictionCardTag.scss';

type TJurisdictionCardTagProps = {
    tag: string;
};

const JurisdictionCardTag: React.FC<TJurisdictionCardTagProps> = ({ tag }) => {
    return (
        <div className='wallets-jurisdiction-card-tag'>
            <WalletText align='center' color='blue' lineHeight='3xs' size='xs' weight='bold'>
                {tag}
            </WalletText>
        </div>
    );
};

export default JurisdictionCardTag;
