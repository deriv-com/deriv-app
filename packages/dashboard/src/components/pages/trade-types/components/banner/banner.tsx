import * as React from 'react';
import { Text, Carousel } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';

const Banner: React.FC<TBannerProps> = ({ banner_items, type }) => {
    const { config_store } = useStores();

    const banners = banner_items.map((banner, idx) => {
        return (
            <div className='dw-banner' key={idx}>
                <div className='dw-banner__frame'>
                    <img
                        draggable={true}
                        className='dw-banner__image'
                        src={`${config_store.asset_path}/images/${banner.bg_image_url}`}
                        alt={banner.bg_image_url.split('/')[banner.bg_image_url.split('/').length - 1]}
                        width='100%'
                        height='100%'
                    />
                    <div className='dw-banner__container'>
                        <Text size='m' as='h1' color='colored-background' line_height='s'>
                            {type}
                        </Text>
                        <Text
                            className='dw-banner__container--title'
                            size='xl'
                            as='h2'
                            weight='bold'
                            color='colored-background'
                            line_height='s'
                        >
                            {banner.title}
                        </Text>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <Carousel
            className='dw-banner__carousel'
            nav_position='middle'
            show_bullet={false}
            item_per_window={1}
            list={banners}
            width={936}
            initial_index={0}
        />
    );
};

type TBannerProps = {
    banner_items: Array<TBannerItemsProp>;
    type: string;
};

type TBannerItemsProp = {
    title: string;
    bg_image_url: string;
};

export default observer(Banner);
