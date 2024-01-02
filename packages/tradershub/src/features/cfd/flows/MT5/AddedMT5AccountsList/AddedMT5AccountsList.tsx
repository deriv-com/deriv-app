import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';

type TProps = {
    account: THooks.MT5AccountsList;
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

const AddedMT5AccountsList: FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useAuthorize();
    const history = useHistory();
    const { data: jurisdictionStatus } = useJurisdictionStatus(account.landing_company_short || 'svg', account.status);
    const { title } = MarketTypeDetails[account.market_type ?? 'all'];

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='flex flex-col gap-y-200'>
                    <Button
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() => {
                            history.push('/wallets/cashier/transfer');
                        }}
                        variant='secondary'
                    >
                        Transfer
                    </Button>
                    <Button
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        // onClick show MT5TradeModal
                    >
                        Open
                    </Button>
                </div>
            )}
        >
            <div className='flex-grow user-select-none'>
                <div className='flex flex-center gap-400 self-stretch'>
                    <Text size='sm'>{title}</Text>
                    {!activeWallet?.is_virtual && (
                        <div className='flex h-1200 py-50 px-200 gap-200 items-center rounded-md bg-system-light-secondary-background'>
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
