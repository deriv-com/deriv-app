import React, { FC } from 'react';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import DerivNakala from '../../../public/images/ic-account-deriv-nakala.svg';
import './product-linked-banner.scss';

interface ProductLinkedBannerProps {
    description: string;
    onClick: () => void;
}

const ProductLinkedBanner: FC<ProductLinkedBannerProps> = ({ description, onClick }) => {
    return (
        <div className='wallets-product-linked-banner' onClick={onClick}>
            <div className='wallets-product-linked-banner__content'>
                <div className='wallets-product-linked-banner__icon'>
                    <DerivNakala height={32} width={32} />
                </div>
                <Text color='prominent' size='sm'>
                    {description}
                </Text>
            </div>
            <LabelPairedChevronRightMdRegularIcon fill='var(--text-prominent)' />
        </div>
    );
};

export default ProductLinkedBanner;
