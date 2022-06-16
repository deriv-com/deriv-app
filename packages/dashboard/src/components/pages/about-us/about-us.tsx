import React from 'react';
import { Text } from '@deriv/components';
import TempButtons from 'Components/temp-buttons';

const AboutUs: React.FC = () => {
    return (
        <div className='dw-about-us'>
            <Text as='p' size='l' color='less-prominent' align='center'>
                About us
            </Text>
            <TempButtons />
        </div>
    );
};

export default AboutUs;
