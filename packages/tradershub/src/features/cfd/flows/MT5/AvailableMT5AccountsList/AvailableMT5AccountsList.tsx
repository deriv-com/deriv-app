import React from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <Button
                    className='rounded-200'
                    colorStyle='coral'
                    variant='primary' /* onClick show MT5PasswordModal : JurisdictionModal */
                >
                    Get
                </Button>
            )}
        >
            <div className='flex-grow user-select-none'>
                <Text bold className='leading-[20px]' size='md'>
                    {title}
                </Text>
                <Text className='leading-[14px] text-[12px]'>{description}</Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
