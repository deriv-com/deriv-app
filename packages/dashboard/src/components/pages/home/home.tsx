import * as React from 'react';
// import { Text } from '@deriv/components';
// import TempButtons from 'Components/temp-buttons';
import CFDTest from '../trade-type/cfd-test';

const Home: React.FC = () => {
    return (
        <React.Fragment>
            <div className='dw-home'>
                {/* <Text as='p' size='l' color='less-prominent' align='center'>
                    Home
                </Text>
                <TempButtons /> */}
                <CFDTest />
            </div>
        </React.Fragment>
    );
};

export default Home;
