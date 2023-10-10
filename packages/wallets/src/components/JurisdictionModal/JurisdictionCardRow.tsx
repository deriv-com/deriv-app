import React from 'react';

import './JurisdictionCardRow.scss';

type TJurisdictionCardRowProps = {
    description?: React.ReactNode | string;
    renderTag?: () => React.ReactNode;
    title: string;
};

const JurisdictionCardRow: React.FC<TJurisdictionCardRowProps> = ({ description, renderTag, title }) => {
    return (
        <div className='wallets-jurisdiction-card-row'>
            <div className='wallets-jurisdiction-card-row__header'>
                <div className='wallets-jurisdiction-card-row__header-title'>{title}</div>
                {renderTag && <div className='wallets-jurisdiction-card-row__header-tag'>{renderTag()}</div>}
            </div>
            {description && <div className='wallets-jurisdiction-card-row__content'>{description}</div>}
        </div>
    );
};

export default JurisdictionCardRow;
