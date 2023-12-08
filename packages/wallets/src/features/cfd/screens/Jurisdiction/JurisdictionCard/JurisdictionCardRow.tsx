import React from 'react';
import { WalletText } from '../../../../../components/Base/WalletText';
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
                <WalletText size='sm' weight='bold'>
                    {title}
                </WalletText>
                {renderTag && <div className='wallets-jurisdiction-card-row__header-tag'>{renderTag()}</div>}
            </div>
            {description && <WalletText size='xs'>{description}</WalletText>}
        </div>
    );
};

export default JurisdictionCardRow;
