import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthorize, usePOA } from '@deriv/api';
import { InlineMessage, WalletButton, WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import './AddedMT5AccountsList.scss';
import { getJurisdictionContents } from '../../../screens/Jurisdiction/jurisdiction-contents/jurisdiction-contents';
import { VerificationFailedModal, MT5TradeModal } from '../../../modals';

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
    const { data: poaStatus } = usePOA();
    const { title } = MarketTypeDetails[account.market_type || 'all'];
    const { show } = useModal();

    const verificationDocs = getJurisdictionContents()[account?.landing_company_short || 'svg']?.verificationDocs;
    const shouldRequireNameAndAddress =
        verificationDocs && account?.market_type !== 'all'
            ? verificationDocs?.[account.market_type || 'financial']?.some(doc => doc === 'nameAndAddress')
            : false;

    const isFailedAuthentication = () => {
        if (shouldRequireNameAndAddress) return poaStatus?.is_need_submission;
        return false;
    };

    const isPendingAuthentication = () => {
        if (shouldRequireNameAndAddress) return poaStatus?.is_pending;
        return false;
    };

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => (
                <div className='wallets-added-mt5__actions'>
                    <WalletButton
                        disabled={isFailedAuthentication() || isPendingAuthentication()}
                        onClick={() => {
                            history.push('/wallets/cashier/transfer');
                        }}
                        text='Transfer'
                        variant='outlined'
                    />
                    <WalletButton
                        disabled={isFailedAuthentication() || isPendingAuthentication()}
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
                {!(isPendingAuthentication() || isFailedAuthentication()) && (
                    <p className='wallets-added-mt5__details-balance'>{account.display_balance}</p>
                )}
                <p className='wallets-added-mt5__details-loginid'>{account.display_login}</p>
                {isPendingAuthentication() && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage size='xs' type='warning' variant='outlined'>
                            <WalletText color='warning' size='2xs' weight='bold'>
                                Pending verification
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}
                {isFailedAuthentication() && (
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
