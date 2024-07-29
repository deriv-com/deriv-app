import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { WalletText } from '../../../../../../components/Base';
import RightArrow from '../../../../../../public/images/navigation-chevron-right.svg';
import { TDocumentType } from '../../constants';
import './DocumentSelectionCard.scss';

type TProps = TDocumentType & {
    onClick: (document: string) => void;
};

const DocumentSelectionCard: React.FC<TProps> = ({ description, icon: Icon, onClick, title, value }) => {
    const { isDesktop } = useDevice();
    return (
        <button className='wallets-document-selection-card' data-testid={`dt_${value}`} onClick={() => onClick(value)}>
            <div className='wallets-document-selection-card__content'>
                <Icon />
                <div className='wallets-document-selection-card__text-content'>
                    <WalletText size={isDesktop ? 'sm' : 'xs'} weight='bold'>
                        {title}
                    </WalletText>
                    <WalletText size={isDesktop ? 'xs' : '2xs'}>{description}</WalletText>
                </div>
            </div>
            <RightArrow />
        </button>
    );
};

export default DocumentSelectionCard;
