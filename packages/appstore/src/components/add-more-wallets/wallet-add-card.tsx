import React from 'react';
import { Text, WalletCard } from '@deriv/components';
import { localize } from '@deriv/translations';

const AddWalletCard = () => (
    <div className='add-wallets__card'>
        <div className='add-wallets__card-wrapper'>
            <WalletCard
                wallet={{
                    balance: 0,
                    currency: 'BTC',
                    icon: 'IcWalletDefault',
                    icon_type: 'crypto',
                    jurisdiction_title: 'svg',
                    name: 'bitcoin',
                }}
                size='medium'
                state='add'
            />
            <div className='add-wallets__card-description'>
                <Text as='h3' size='s' weight='bold'>
                    {localize('BTC Wallet')}
                </Text>
                <Text as='p' size='xs' color=''>
                    {localize(
                        "Deposit and withdraw Bitcoin, the world's most popular cryptocurrency, hosted on the Bitcoin blockchain."
                    )}
                </Text>
            </div>
        </div>
    </div>
);

export default AddWalletCard;
