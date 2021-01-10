import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import Frame from 'Components/elements/frame';
import { useStores } from 'Stores';

const Banner: React.FC<TBannerProps> = ({ type, title }) => {
    const { config_store } = useStores();

    return (
        <React.Fragment>
            <div className='template__banner'>
                <Frame
                    src={`${config_store.asset_path}/images/trade-type/banner-background.png`}
                    alt='banner-background'
                />
                <div className='template__banner-container'>
                    <Text size='m' color='colored-background' styles={{ lineHeight: '3rem' }}>
                        {type}
                    </Text>
                    <Text size='xl' weight='bold' color='colored-background' styles={{ lineHeight: '6rem' }}>
                        {title}
                    </Text>
                </div>
            </div>
        </React.Fragment>
    );
};

type TBannerProps = {
    type: string;
    title: string;
};

export default observer(Banner);
