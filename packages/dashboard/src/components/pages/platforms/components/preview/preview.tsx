import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStores } from 'Stores';

const GetSection: React.FC = () => {
    const { config_store } = useStores();

    return (
        <section className='dw-preview'>
            <div className='dw-preview__item-wrapper'>
                <img className='dw-preview__item' src={`${config_store.asset_path}/images/dmt5-synthetic-1.png`} />
                <img className='dw-preview__item dw-preview__item--middle' src={`${config_store.asset_path}/images/dmt5-synthetic-2.png`} />
                <Icon className='dw-preview__icon' icon='IcChevronRightBold' width='16' height='16' />
            </div>
            <Text color='less-prominent' size='xs'>{localize('Available on desktop and mobile')}</Text>
        </section>
    );
};

export default GetSection;
