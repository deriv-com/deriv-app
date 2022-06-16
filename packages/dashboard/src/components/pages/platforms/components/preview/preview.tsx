import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, Icon } from '@deriv/components';
import { useStores } from 'Stores';
import { TStringTranslation } from 'Types';

const GetSection: React.FC<TGetSection> = ({ availability_text, images }) => {
    const { config_store } = useStores();

    return (
        <section className='dw-preview'>
            <div className='dw-preview__item-wrapper'>
                {images.map((image, idx) => (
                    <img key={idx} className='dw-preview__item' src={`${config_store.asset_path}/images/${image}`} />
                ))}

                <Icon className='dw-preview__icon' icon='IcChevronRightBold' width='16' height='16' />
            </div>
            <Text color='less-prominent' size='xs'>
                {availability_text}
            </Text>
        </section>
    );
};

type TGetSection = {
    availability_text: TStringTranslation;
    images: string[];
};

export default observer(GetSection);
