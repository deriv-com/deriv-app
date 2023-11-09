import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api';
import { WalletButton } from '../../../../../components/Base';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import './AddedMT5AccountsList.scss';
import { useModal } from '../../../../../components/ModalProvider';
import { MT5TradeModal } from '../../../modals';

type TProps = {
    account: THooks.MT5AccountsList;
};

const MT5AccountIcon: React.FC<TProps> = ({ account }) => {
    const IconToLink = () => {
        switch (account.market_type) {
            case 'financial':
            case 'synthetic':
            case 'all':
                return window.open(getStaticUrl('/dmt5'));
            default:
                return window.open(getStaticUrl('/dmt5'));
        }
    };
    return (
        <div className='wallets-added-mt5__icon' onClick={() => IconToLink()}>
            {MarketTypeDetails[account.market_type || 'all'].icon}
        </div>
    );
};

const AddedMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useAuthorize();
    const history = useHistory();
    const { show } = useModal();
    const { title } = MarketTypeDetails[account.market_type || 'all'];
    const { data: verification_status } = useJurisdictionStatus(account);

    const { poa_status: poaStatus, poi_status: poiStatus } = verification_status?.verification_status || {};

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='wallets-added-mt5__actions'>
                    <WalletButton
                        onClick={() => {
                            history.push('/wallets/cashier/transfer');
                        }}
                        text='Transfer'
                        variant='outlined'
                    />
                    <WalletButton
                        onClick={() => show(<MT5TradeModal marketType={account.market_type || 'all'} platform='mt5' />)}
                        text='Open'
                    />
                </div>
            )}
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <p className='wallets-added-mt5__details-title-text'>{title}</p>
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
                {poiStatus === 'failed' && poaStatus === 'failed' && <h1>Failed</h1>}
                {(poaStatus === 'pending' || poiStatus === 'pending') && <h1>Pending</h1>}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
