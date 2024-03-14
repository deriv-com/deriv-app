import React, { ComponentProps } from 'react';
import { Button, Text } from '@deriv-com/ui';

type TTradingAccountCardContent = {
    children: string;
    title: string;
};

export const TradingAccountCardContent = ({ children, title }: TTradingAccountCardContent) => (
    <div className='grow'>
        <Text as='p' className='text-sm lg:text-default leading-22' weight='bold'>
            {title}
        </Text>
        <Text className='w-5/6 leading-18 lg:w-full' size='xs'>
            {children}
        </Text>
    </div>
);

type TTradingAccountCardButton = {
    onSubmit?: ComponentProps<typeof Button>['onClick'];
};

export const TradingAccountCardLightButton = ({ onSubmit }: TTradingAccountCardButton) => (
    <Button color='primary-light' onClick={onSubmit}>
        Get
    </Button>
);
