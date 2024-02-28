import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../../components/Base/WalletText';
import './JurisdictionCardRow.scss';

type TJurisdictionCardRowProps = {
    className: string;
    description?: React.ReactNode | string;
    renderTag?: () => React.ReactNode;
    title: string;
};

const JurisdictionCardRow: React.FC<TJurisdictionCardRowProps> = ({ className, description, renderTag, title }) => {
    return (
        <div className={classNames('wallets-jurisdiction-card-row', className)}>
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
