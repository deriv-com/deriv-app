import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv/translations';
import PlatformCard from './platform-card';

type TPlatform = {
    platform_name?: string;
    icon_title?: string;
    description?: string;
    checked?: boolean;
};

const Platform = ({ platform_name, icon_title, description, checked }: TPlatform) => {
    return (
        <div>
            <PlatformCard
                platform_name={platform_name}
                icon_title={icon_title}
                description={description}
                checked={checked}
            />
        </div>
    );
};

const ProductCardModal = () => {
    const header = localize('Choose a product');
    const small_header = localize('Choose a product to start.');
    const [index_checked, set_index_checked] = React.useState(0);
    const platform_data = [
        {
            platform_name: 'Deriv MT5',
            icon_title: 'icBrandDmt5',
            description: 'Trade on Deriv MT5 (DMT5), the all-in-one FX and CFD trading platform.',
        },
        {
            platform_name: 'Deriv X',
            icon_title: 'icBrandDxtrade',
            description: 'Trade FX and CFDs on a customisable, easy-to-use trading platform.',
        },
    ];

    return (
        <>
            <div className='product-card-modal'>
                <p className='product-card-modal__header'>{header}</p>
                <p className='product-card-modal__small-header'>{small_header}</p>

                <div className='product-card-modal__wrapper'>
                    {platform_data.map((item, idx) => (
                        <div
                            key={idx}
                            className={classNames(
                                'product-card-modal__wrapper--child',
                                idx % 2 !== 1 && 'product-card-modal__wrapper--odd-child'
                            )}
                            onClick={() => set_index_checked(idx)}
                        >
                            <Platform
                                platform_name={item.platform_name}
                                icon_title={item.icon_title}
                                description={item.description}
                                checked={idx === index_checked}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ProductCardModal;
