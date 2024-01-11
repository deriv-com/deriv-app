import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];

    const LeadingIcon = () => <MT5AccountIcon account={account} />;

    const TrailingButton = () => (
        <Button className='rounded-200' colorStyle='coral' variant='primary'>
            Get
        </Button>
    );

    return (
        <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
            <div className='grow user-select-none'>
                <Text bold className='leading-200' size='sm'>
                    {title}
                </Text>
                <Text className='text-[12px] leading-100 w-5/6 lg:w-full'>{description}</Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
