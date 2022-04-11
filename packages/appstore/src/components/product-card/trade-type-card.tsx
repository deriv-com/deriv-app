import React from 'react';
import { getUrlBase } from '@deriv/shared';
import { Icon } from '@deriv/components';

type TProductTradeTypeCard = {
    type?: string;
    icon_title?: string;
    description?: string;
    checked?: boolean;
    bg_image_title?: string;
};

const TradeTypeCard = ({ type, icon_title, description, checked, bg_image_title }: TProductTradeTypeCard) => {
    const bg_url = getUrlBase(`/public/images/common/appstore/${bg_image_title}.png`);
    const bg_url_style = {
        backgroundImage: `url(${bg_url})`,
    };

    return (
        <div className='product-card product-card-trade-type'>
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
        </div>
    );
};
export default TradeTypeCard;
