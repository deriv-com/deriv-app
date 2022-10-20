import React from 'react';
import { localize } from '@deriv/translations';
import { ProductCard } from 'Components/product-card';
import './choose-product.scss';

const ChooseProduct = () => {
    const [selected_product, setSeletedProduct] = React.useState('');

    // TODO: add conditions to show/hide products
    const tradetype = [
        {
            type: 'CFDs',
            icon_title: 'icAppstoreMultipliersTradeType',
            description: localize('Trade with leverage and tight spreads for better returns on successful trades.'),
            checked: selected_product === 'CFDs',
            bg_image_title: 'appstore_cfds_trade_type_bg',
        },
        {
            type: 'Multipliers',
            icon_title: 'icAppstoreCfdsTradeType',
            description: localize('Combine the upside of CFDs with the simplicity of options.'),
            checked: selected_product === 'Multipliers',
            bg_image_title: 'appstore_multipliers_trade_type_bg',
        },
        {
            type: 'Options',
            icon_title: 'icAppstoreOptionTradeType',
            description: localize('Earn fixed payouts by predicting an asset price movement.'),
            checked: selected_product === 'Options',
            bg_image_title: 'appstore_options_trade_type_bg',
        },
    ];

    return (
        <div className='choose-product'>
            {tradetype.map((item, idx) => (
                <div key={idx} className='choose-product__item' onClick={() => setSeletedProduct(item.type)}>
                    <ProductCard product_card={true} trade_type_details={item} />
                </div>
            ))}
        </div>
    );
};

export default ChooseProduct;
