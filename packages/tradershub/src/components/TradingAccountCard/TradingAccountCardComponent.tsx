import React from 'react';
import { ButtonProps, Text } from '@deriv/quill-design';
import { Button } from '@deriv-com/ui';

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
    <Button color='primary-light' onClick={onSubmit}>
        Get
    </Button>
);
