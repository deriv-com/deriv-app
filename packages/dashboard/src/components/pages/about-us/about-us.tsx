import * as React from 'react';
import { Text } from '@deriv/components';
import TempButtons from 'Components/temp-buttons';

const AboutUs: React.FC = () => {
    return (
        <div className='dw-about-us'>
            <Text as='p' size='l' color='less-prominent' align='center'>
                About us
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
