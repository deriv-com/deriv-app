import React from 'react';
import { Text } from '@deriv-com/ui';

const EUDisclaimerMessage = () => (
    <div className='fixed bottom-[36px] w-full bg-system-light-secondary-background'>
        <div className='max-w-[1390px] mx-auto py-8 sm:px-16'>
            <Text className='w-full text-default sm:text-xs leading-[1.5]'>
                <span className='font-bold'>EU statutory disclaimer</span>: CFDs are complex instruments and come with a
                high risk of losing money rapidly due to leverage.
                <span className='font-bold'>
                    70.1% of retail investor accounts lose money when trading CFDs with this provider
                </span>
                . You should consider whether you understand how CFDs work and whether you can afford to take the high
                risk of losing your money.
            </Text>
        </div>
    </div>
);

export default EUDisclaimerMessage;
