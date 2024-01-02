import React, { FC } from 'react';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const MT5AccountIcon: FC<TProps> = ({ account }) => {
    const handleClick = () => {
        window.open(getStaticUrl('/dmt5'));
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Fix sonarcloud issue
        if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
        }
    };
    return (
        <div className='cursor-pointer' onClick={handleClick} onKeyDown={handleKeyDown} role='button' tabIndex={0}>
            {MarketTypeDetails[account.market_type || 'all'].icon}
        </div>
    );
};

const AvailableMT5AccountsList: FC<TProps> = ({ account }) => {
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
                <Text className='leading-[14px]' size='sm'>
                    {description}
                </Text>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
