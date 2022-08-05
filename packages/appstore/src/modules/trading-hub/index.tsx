import * as React from 'react';
import { useStores } from 'Stores';
import { Authorize } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { ArrayElement } from 'Types';

type DemoWalletProps = {
    account: ArrayElement<Required<Authorize>['account_list']>;
};

const DemoWallet = ({ account }: DemoWalletProps) => {
    return (
        <div
            style={{
                display: 'flex',
                background: 'pink',
                margin: '30px 20px',
                padding: '16px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    background: 'red',
                }}
            >
                <Localize
                    key={0}
                    i18n_default_text='Demo {{currency}} wallet'
                    values={{ currency: account.currency }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {localize('Virtual balance')}
                    <Money amount={account.wallet?.balance} currency={account.currency} show_currency />
                </div>
            </div>
            <div>arrow</div>
        </div>
    );
};

const TradingHub = () => {
    const { client } = useStores();

    const wallet_accounts = (client.wallet_accounts || []) as Required<Authorize>['account_list'];

    return (
        <div className='trading-hub'>
            {wallet_accounts.map(account => {
                if (account.is_virtual) {
                    return <DemoWallet account={account} />;
                }
                return null;
            })}
        </div>
    );
};

export default TradingHub;
