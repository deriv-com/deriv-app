import React, { FC } from 'react';
import { Button, Text } from '@deriv/quill-design';

const GetADerivAccountBanner: FC = () => {
    return (
        <div className='flex items-center self-stretch justify-center p-800 gap-800 rounded-200 bg-system-light-secondary-background'>
            <Text bold>You need a Deriv account to create a CFD account.</Text>
            <Button className='rounded-200'>Get a Deriv account</Button>
        </div>
    );
};

export default GetADerivAccountBanner;
