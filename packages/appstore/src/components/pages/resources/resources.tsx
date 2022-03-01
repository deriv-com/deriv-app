import * as React from 'react';
import { Text } from '@deriv/components';
import TempButtons from 'Components/temp-buttons';

const Resources: React.FC = () => {
    return (
        <div className='dw-resources'>
            <Text as='p' size='l' color='less-prominent' align='center'>
                Resources
            </Text>
            <TempButtons />
        </div>
    );
};

export default Resources;
