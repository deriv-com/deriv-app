import React from 'react';
import './JurisdictionCardTag.scss';

type TJurisdictionCardTagProps = {
    tag: string;
};
const JurisdictionCardTag = ({ tag }: TJurisdictionCardTagProps) => {
    return (
        <div className='wallets-jurisdiction-card-tag'>
            <div className='wallets-jurisdiction-card-tag__label'>{tag}</div>
        </div>
    );
};

export default JurisdictionCardTag;
