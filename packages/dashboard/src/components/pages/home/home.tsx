import * as React from 'react';
import { Text } from '@deriv/components';
import TempButtons from 'Components/temp-buttons';
import Sidebar from 'Components/elements/sidebar';

const Home: React.FC = () => {
    return (
        <React.Fragment>
            {/* <Sidebar /> */}
            <div className='dw-home'>
                {/* <Text as='p' size='l' color='less-prominent' align='center'>
                    Home
                </Text>
                <TempButtons /> */}
                <Sidebar />
            </div>
        </React.Fragment>
    );
};

export default Home;
