import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAuthentication, useAuthorize } from '@deriv/api';
import { InlineMessage, WalletButton, WalletText } from '../../../../../components/Base';
import { TradingAccountCard } from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import './AddedMT5AccountsList.scss';
import { getJurisdictionContents } from '../../../screens/Jurisdiction/jurisdiction-contents/jurisdiction-contents';

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
    const { data: authenticationStatus } = useAuthentication();
    const { title } = MarketTypeDetails[account.market_type || 'all'];

    const verificationDocs = getJurisdictionContents()['bvi']?.verificationDocs;
    const shouldRequireDocuments = verificationDocs?.[account.market_type || 'financial'].some(doc =>
        ['documentNumber', 'identityDocument'].includes(doc)
    );
    const shouldRequireNameAndAddress = verificationDocs?.[account.market_type || 'financial'].some(
        doc => doc === 'nameAndAddress'
    );

    console.log(account.landing_company_short, verificationDocs, shouldRequireDocuments, shouldRequireNameAndAddress);

    const hasDocumentsSubmitted = () => {
        if (shouldRequireDocuments && shouldRequireNameAndAddress)
            return !(authenticationStatus?.is_poa_not_submitted && authenticationStatus?.is_poi_not_submitted);
        if (shouldRequireDocuments) return !authenticationStatus?.is_poi_not_submitted;
        if (shouldRequireNameAndAddress) return !authenticationStatus?.is_poa_not_submitted;
        return true;
    };

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
                    <WalletButton text='Open' />
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
                {!(authenticationStatus?.is_poa_not_submitted && authenticationStatus?.is_poi_not_submitted) && (
                    <p className='wallets-added-mt5__details-balance'>{account.display_balance}</p>
                )}
                <p className='wallets-added-mt5__details-loginid'>{account.display_login}</p>
                {!hasDocumentsSubmitted() && (
                    <div className='wallets-added-mt5__details-badge'>
                        <InlineMessage type='error' variant='outlined' size='xs'>
                            <WalletText size='2xs' weight='bold' color='error'>
                                Verification failed. Why?
                            </WalletText>
                        </InlineMessage>
                    </div>
                )}
            </div>
        </TradingAccountCard>
    );
};

export default AddedMT5AccountsList;
