import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthorize, useJurisdictionStatus } from '@deriv/api';
import { InlineMessage, WalletButton, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails, PlatformDetails } from '../../../constants';
import { MT5TradeModal, VerificationFailedModal } from '../../../modals';
import './AddedMT5AccountsList.scss';

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
    const { data: jurisdictionStatus } = useJurisdictionStatus(account.landing_company_short || 'svg', account.status);
    const { title } = MarketTypeDetails[account.market_type ?? 'all'];
    const { show } = useModal();

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='wallets-added-mt5__actions'>
                    <WalletButton
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() => {
                            history.push('/wallets/cashier/transfer');
                        }}
                        variant='outlined'
                    >
                        Transfer
                    </WalletButton>
                    <WalletButton
                        disabled={jurisdictionStatus.is_failed || jurisdictionStatus.is_pending}
                        onClick={() =>
                            show(
                                <MT5TradeModal
                                    marketType={account.market_type ?? 'all'}
                                    mt5Account={account}
                                    platform={PlatformDetails.mt5.platform}
                                />
                            )
                        }
                    >
                        Open
                    </WalletButton>
                </div>
            )}
        >
            <div className='wallets-added-mt5__details'>
                <div className='wallets-added-mt5__details-title'>
                    <WalletText size='sm'>{title}</WalletText>
                    {!activeWallet?.is_virtual && (
                        <div className='wallets-added-mt5__details-title-landing-company'>
                            <WalletText size='2xs' weight='bold'>
                                {account.landing_company_short?.toUpperCase()}
                            </WalletText>
                        </div>
                    )}
                </div>
                {!(jurisdictionStatus.is_failed || jurisdictionStatus.is_pending) && (
                    <WalletText size='sm' weight='bold'>
                        {account.display_balance}
                    </WalletText>
                )}
                <WalletText as='p' color='primary' size='xs' weight='bold'>
                    {account.display_login}
                </WalletText>
                {jurisdictionStatus.is_pending && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='warning' variant='outlined'>
                            <WalletText color='warning' size='2xs' weight='bold'>
                                Pending verification
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}
                {jurisdictionStatus.is_failed && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='error' variant='outlined'>
                            <WalletText color='error' size='2xs' weight='bold'>
                                Verification failed.{' '}
                                <a
                                    onClick={() =>
                                        show(<VerificationFailedModal />, {
                                            defaultRootId: 'wallets_modal_root',
                                        })
                                    }
                                >
                                    Why?
                                </a>
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
