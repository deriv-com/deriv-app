import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import Frame from 'Components/elements/frame';
import { useStores } from 'Stores';

const YouMightLikeCard: React.FC<TYouMightLikeCardProps> = ({ bg_image, title, sub_title }) => {
    const { config_store } = useStores();

    return (
        <div className='dw-element-template__you-might-like-card'>
            <Frame
                src={`${config_store.asset_path}/images/trade-type/${bg_image}.png`}
                alt={bg_image}
                className='dw-element-template__you-might-like-card-image'
            />
            <Text weight='bold' line_height='l'>
                {title}
            </Text>
            <Text size='xs' color='less-prominent' line_height='m'>
                {sub_title}
            </Text>
        </div>
    );
};

type TYouMightLikeCardProps = {
    bg_image: string;
    title: string;
    sub_title: string;
};

export default observer(YouMightLikeCard);
