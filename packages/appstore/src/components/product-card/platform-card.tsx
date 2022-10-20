import React from 'react';
import { Icon } from '@deriv/components';

type TProductPlatformCard = {
    platform_name?: string;
    icon_title?: string;
    description?: string;
    checked?: boolean;
};

const PlatformCard = ({ platform_name, icon_title, description, checked }: TProductPlatformCard) => {
    return (
        <div className='product-card product-card-platform'>
            {checked && (
                <div className='product-card-platform--check'>
                    <Icon icon='icAppstoreCheckedTransparent' />
                </div>
            )}
            <div className='product-card-platform__wrapper'>
                <div>
                    <Icon icon={icon_title} width='32' height='32' className='product-card-platform__wrapper--icon' />
                </div>
                <div className='product-card-platform__wrapper__block'>
                    <p className='product-card-platform__wrapper__block--header'>{platform_name}</p>
                    <p className='product-card-platform__wrapper__block--description'>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default PlatformCard;
