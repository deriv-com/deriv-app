import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import Frame from 'Components/elements/frame';
import { useStores } from 'Stores';

const AboutUs: React.FC = () => {
    const { config_store } = useStores();
    const total_previews = 27;

    return (
        <div className='dw-about-us'>
            <Text className='dw-about-us__text dw-about-us__title' as='h1' size='l' color='general' align='center'>
                {localize('HALL OF FAME')}
            </Text>
            <Text
                className='dw-about-us__text dw-about-us__subtitle'
                as='p'
                size='m'
                color='less-prominent'
                align='center'
            >
                {localize('Our front-end evolution has been powered by these amazing people')}
            </Text>
            <div className='dw-about-us__wrapper'>
                {Array.from(new Array(total_previews).keys()).map(key => (
                    <Frame src={`${config_store.asset_path}/images/placeholder.png`} key={key} alt={`p${key + 1}`} />
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
