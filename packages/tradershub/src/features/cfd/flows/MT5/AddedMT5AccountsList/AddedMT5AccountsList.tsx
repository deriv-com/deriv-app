import React from 'react';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { TradeModal } from '../../../modals/TradeModal';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AddedMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { data: activeWallet } = useAuthorize();
    const { show } = Provider.useModal();
    const { data: jurisdictionStatus } = useJurisdictionStatus(account.landing_company_short || 'svg', account.status);
    const { title } = MarketTypeDetails[account.market_type ?? 'all'];

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='flex flex-col gap-y-200'>
                    <Button
                        className='border-opacity-black-400 rounded-200 px-800'
                        colorStyle='black'
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() => {
                            // why wallets ???
                            // history.push('/wallets/cashier/transfer');
                        }}
                        variant='secondary'
                    >
                        Transfer
                    </Button>
                    <Button
                        className='rounded-200 px-800'
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() =>
                            show(<TradeModal account={account} marketType={account?.market_type} platform='mt5' />)
                        }
                    >
                        Open
                    </Button>
                </div>
            )}
        >
            <div className='flex-grow user-select-none'>
                <div className='flex self-stretch flex-center gap-400'>
                    <Text size='sm'>{title}</Text>
                    {!activeWallet?.is_virtual && (
                        <div className='flex items-center rounded-md h-1200 py-50 px-200 gap-200 bg-system-light-secondary-background'>
                            <Text bold size='sm'>
                                {account.landing_company_short?.toUpperCase()}
                            </Text>
                        </div>
                    )}
                </div>
                {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                    <Text bold size='sm'>
                        {account.display_balance}
                    </Text>
                )}
                <Text bold size='sm'>
                    {account.display_login}
                </Text>
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
