import React from 'react';
import classNames from 'classnames';
import { getUrlBase } from '@deriv/shared';
import { Icon } from '@deriv/components';

type TProductCardType = {
    product_card: boolean;
    platform_details?: TProductPlatformCard;
    trade_type_details?: TProductTradeTypeCard;
};

type TProductTradeTypeCard = {
    type?: string;
    icon_title?: string;
    description?: string;
    checked?: boolean;
    bg_image_title?: string;
};

type TProductPlatformCard = {
    platform_name?: string;
    icon_title?: string;
    description?: string;
    checked?: boolean;
};

const PlatformCard = ({ platform_name, icon_title, description, checked }: TProductPlatformCard) => {
    return (
        <>
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
        </>
    );
};

const TradeTypeCard = ({ type, icon_title, description, checked, bg_image_title }: TProductTradeTypeCard) => {
    const bg_url = getUrlBase(`/public/images/common/appstore/${bg_image_title}.png`);
    const bg_url_style = {
        backgroundImage: `url(${bg_url})`,
    };

    return (
        <div style={bg_url_style} className='product-card-trade-type__wrapper'>
            {checked && (
                <div className='product-card-trade-type__wrapper--check'>
                    <Icon icon='icAppstoreChecked' />
                </div>
            )}

            <p className='product-card-trade-type__wrapper--header'>{type}</p>
            <div className='product-card-trade-type__wrapper__second-row'>
                <div>
                    <Icon
                        icon={icon_title}
                        width='32'
                        height='32'
                        className='product-card-trade-type__wrapper__second-row--icon'
                    />
                </div>
                <p>{description}</p>
            </div>
        </div>
    );
};

const ProductCard = ({ product_card, platform_details, trade_type_details }: TProductCardType) => {
    const card_type = product_card ? 'product-card-trade-type' : 'product-card-platform';
    const platform_component = (
        <PlatformCard
            platform_name={platform_details?.platform_name}
            icon_title={platform_details?.icon_title}
            description={platform_details?.description}
            checked={platform_details?.checked}
        />
    );

    const trade_type_component = (
        <TradeTypeCard
            type={trade_type_details?.type}
            icon_title={trade_type_details?.icon_title}
            description={trade_type_details?.description}
            bg_image_title={trade_type_details?.bg_image_title}
            checked={trade_type_details?.checked}
        />
    );

    const main_card = product_card ? trade_type_component : platform_component;

    return <div className={classNames('product-card', card_type)}>{main_card}</div>;
};

export default ProductCard;
