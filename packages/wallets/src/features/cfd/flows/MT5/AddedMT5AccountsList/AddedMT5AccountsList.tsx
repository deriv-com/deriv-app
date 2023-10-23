import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthorize } from '@deriv/api';
import { WalletButton } from '../../../../../components/Base';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { THooks } from '../../../types';
import './AddedMT5AccountsList.scss';
import { MarketTypeToIconMapper, MarketTypeToTitleMapper } from '../../../constants';

type TProps = {
    account: THooks.MT5AccountsList;
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useAuthorize();
    const history = useHistory();
    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-added-mt5__icon'>{MarketTypeToIconMapper[account.market_type || 'all']}</div>
            )}
            trailing={() => (
                <div className='wallets-added-mt5__actions'>
                    <WalletButton
                        onClick={() => {
                            history.push('/wallets/cashier/transfer');
                        }}
                        text='Transfer'
                        variant='outlined'
                    />
                    <WalletButton text='Open' />
                </div>
            )}
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <p className='wallets-added-mt5__details-title-text'>
                        {MarketTypeToTitleMapper[account.market_type || 'all']}
                    </p>
                    {!activeWallet?.is_virtual && (
                        <div className='wallets-added-mt5__details-title-landing-company'>
                            <p className='wallets-added-mt5__details-title-landing-company-text'>
                                {account.landing_company_short}
                            </p>
                        </div>
                    )}
                </div>
                <p className='wallets-added-mt5__details-balance'>{account.display_balance}</p>
                <p className='wallets-added-mt5__details-loginid'>{account.display_login}</p>
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
