import * as React from 'react';
import { Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';

const Banner: React.FC<TBannerProps> = ({ type, title }) => {
    return (
        <div className='dw-banner'>
            <div className='dw-banner__frame'>
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
