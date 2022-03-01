import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import Frame from 'Components/elements/frame';
import { useStores } from 'Stores';

const Banner: React.FC<TBannerProps> = ({ bg_image_url, type, title }) => {
    const { config_store } = useStores();

    return (
        <div className='dw-banner'>
            <div className='dw-banner__frame'>
                <Frame
                    src={`${config_store.asset_path}/images/${bg_image_url}`}
                    alt={bg_image_url.split('/')[bg_image_url.split('/').length - 1]}
                />
                <div className='dw-banner__container'>
                    <Text size='m' color='colored-background' line_height='xs'>
                        {type}
                    </Text>
                    <Text size='xl' weight='bold' color='colored-background' line_height='xs'>
                        {title}
                    </Text>
                </div>
            </div>
        </div>
    );
};

type TBannerProps = {
    bg_image_url: string;
    type: string;
    title: string;
};

export default observer(Banner);
