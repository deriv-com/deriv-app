import React from 'react';
import { Text } from '@deriv/components';
import TradingPlatformIconProps, { PlatformIcons } from 'Assets/svgs/trading-platform';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';
import './product-linked-banner.scss';

interface ProductLinkedBannerProps {
    icon: keyof typeof PlatformIcons;
    description: string;
    onClick: () => void;
}

const ProductLinkedBanner: React.FC<ProductLinkedBannerProps> = ({ icon, description, onClick }) => {
    return (
        <div className='product-linked-banner' onClick={onClick}>
            <div className='product-linked-banner__content'>
                <div className='product-linked-banner__icon'>
                    <TradingPlatformIconProps icon={icon} />
                </div>
                <Text size='xs' color='prominent'>
                    {description}
                </Text>
            </div>
            <LabelPairedChevronRightMdRegularIcon fill='var(--text-prominent)' />
        </div>
    );
};

export default ProductLinkedBanner;
