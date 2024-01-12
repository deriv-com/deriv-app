import React from 'react';
import { Button, ButtonProps, Text } from '@deriv/quill-design';

type TTradingAccountCardContent = {
    children: string;
    title: string;
};

export const TradingAccountCardContent = ({ children, title }: TTradingAccountCardContent) => (
    <div className='grow'>
        <Text bold className='leading-200' size='sm'>
            {title}
        </Text>
        <Text className='text-[12px] leading-100 w-5/6 lg:w-full'>{children}</Text>
    </div>
);

type TTradingAccountCardButton = {
    onSubmit?: ButtonProps['onClick'];
};

export const TradingAccountCardLightButton = ({ onSubmit }: TTradingAccountCardButton) => (
    <Button
        className='rounded-200 bg-solid-coral-100 text-solid-coral-700 enabled:hover:bg-solid-red-200'
        onClick={onSubmit}
        variant='primary'
    >
        Get
    </Button>
);
