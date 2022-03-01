import * as React from 'react';
import { Text } from '@deriv/components';
import TempButtons from 'Components/temp-buttons';

const Explore: React.FC = () => {
    return (
        <div className='dw-explore'>
            <Text as='p' size='l' color='less-prominent' align='center'>
                Explore
            </Text>
            <TempButtons />
        </div>
    );
};

export default Explore;
