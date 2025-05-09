import React from 'react';

import { Icon, Text } from '@deriv/components';
import { LabelPairedChevronRightMdRegularIcon } from '@deriv/quill-icons';

import './nakala-linked-banner.scss';

interface ProductLinkedBannerProps {
    description: string;
    onClick: () => void;
}

const ProductLinkedBanner: React.FC<ProductLinkedBannerProps> = ({ description, onClick }) => {
    return (
        <div className='product-linked-banner' onClick={onClick}>
            <div className='product-linked-banner__content'>
                <div className='product-linked-banner__icon'>
                    <Icon icon='IcRebrandingDerivNakala' width={32} height={32} />
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
