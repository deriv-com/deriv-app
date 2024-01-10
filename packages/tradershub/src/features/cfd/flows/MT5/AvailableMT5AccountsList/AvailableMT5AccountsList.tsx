import React from 'react';
import { useAuthorize } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { JurisdictionModal } from '../../../modals/JurisdictionModal';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];
    const { data: activeAccount } = useAuthorize();

    const { setCfdState } = Provider.useCFDContext();
    const { show } = Provider.useModal();

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <Button
                    className='rounded-200'
                    colorStyle='coral'
                    onClick={() => {
                        setCfdState('marketType', account.market_type);
                        !activeAccount?.is_virtual && show(<JurisdictionModal />); /* show MT5PasswordModal for demo */
                    }}
                    variant='primary'
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
