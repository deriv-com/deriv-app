import * as React from 'react';
import { Text, Icon } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';

const CardComponent: React.FC<TCardComponentProps> = ({ bg_image_url, children }) => {
    const { config_store } = useStores();

    return (
        <div
            style={{
                backgroundImage: `url(${config_store.asset_path}/images/${bg_image_url})`,
            }}
            className='dw-you-might-like__card'
        >
            {children}
        </div>
    );
};

const YouMightLikeCard: React.FC<TYouMightLikeCardProps> = ({ bg_image_url, icon, title, subtitle }) => {
    return (
        <div className='dw-you-might-like'>
            <CardComponent bg_image_url={bg_image_url}>
                <Icon icon={icon} size={24} className='dw-you-might-like__card-icon' />
                <Text
                    size='sm'
                    as='h5'
                    weight='bold'
                    color='colored-background'
                    line_height='l'
                    className='dw-you-might-like__card-title'
                >
                    {title}
                </Text>
                <Text
                    size='xs'
                    as='p'
                    color='colored-background'
                    line_height='m'
                    className='dw-you-might-like__card-desc'
                >
                    {subtitle}
                </Text>
                <div className='dw-you-might-like__card-overlay' />
            </CardComponent>
        </div>
    );
};

type TCardComponentProps = {
    bg_image_url: string;
};

type TYouMightLikeCardProps = {
    bg_image_url: string;
    icon: string;
    title: string;
    subtitle: string;
};

export default observer(YouMightLikeCard);
