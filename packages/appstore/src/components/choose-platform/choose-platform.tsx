import React from 'react';
import { localize } from '@deriv/translations';
import { PlatformCard } from 'Components/product-card';
import './choose-platform.scss';

type TChoosePlatform = {
    handleSubmit: (product: string) => void;
};

const ChoosePlatform = ({ handleSubmit }: TChoosePlatform) => {
    const [selected_platform, setSeletedPlatform] = React.useState('');

    const setPlatform = (product: string) => {
        setSeletedPlatform(product);
        handleSubmit(product);
    };

    const platforms = [
        {
            type: 'Deriv MT5',
            icon_title: 'icBrandDmt5',
            description: localize('Trade on Deriv MT5 (DMT5), the all-in-one FX and CFD trading platform.'),
            checked: selected_platform === 'Deriv MT5',
        },
        {
            type: 'Deriv X',
            icon_title: 'icBrandDxtrade',
            description: localize('Trade FX and CFDs on a customisable, easy-to-use trading platform.'),
            checked: selected_platform === 'Deriv X',
        },
    ];

    return (
        <div className='choose-platform'>
            {platforms.map((item, idx) => (
                <div key={idx} className='choose-platform__item' onClick={() => setPlatform(item.type)}>
                    <PlatformCard
                        platform_name={item.type}
                        icon_title={item.icon_title}
                        description={item.description}
                        checked={item.checked}
                    />
                </div>
            ))}
        </div>
    );
};

export default ChoosePlatform;
