import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { TradingAccountCard, WalletButton } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import { JurisdictionModal, MT5PasswordModal } from '../../../modals';
import { THooks } from '../../../types';
import './AvailableMT5AccountsList.scss';
import { MarketTypeToDescriptionMapper, MarketTypeToIconMapper, MarketTypeToTitleMapper } from '../../../constants';

type TProps = {
    account: THooks.SortedMT5Accounts;
};

const AvailableMT5AccountsList: React.FC<TProps> = ({ account }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { setModalState, show } = useModal();

    return (
        <TradingAccountCard
            leading={() => (
                <div className='wallets-available-mt5__icon'>
                    {MarketTypeToIconMapper[account.market_type || 'all']}
                </div>
            )}
            trailing={() => (
                <WalletButton
                    color='primary-light'
                    onClick={() => {
                        setModalState({
                            marketType: account.market_type,
                        });
                        show(
                            activeWallet?.is_virtual ? (
                                <MT5PasswordModal
                                    marketType={account?.market_type || 'synthetic'}
                                    platform={account.platform}
                                />
                            ) : (
                                <JurisdictionModal />
                            )
                        );
                    }}
                    text='Get'
                />
            )}
        >
            <div className='wallets-available-mt5__details'>
                <p className='wallets-available-mt5__details-title'>
                    {MarketTypeToTitleMapper[account.market_type || 'all']}
                </p>
                <p className='wallets-available-mt5__details-description'>
                    {MarketTypeToDescriptionMapper[account.market_type || 'all']}
                </p>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
