import React from 'react';
import { Trans } from 'react-i18next';
import {
    useAccountStatus,
    useActiveWalletAccount,
    useAuthentication,
    useCashierValidation,
    useQuery,
    useSettings,
} from '@deriv/api-v2';
import { WalletsActionScreen } from '../../../../components';
import getDepositLockedDesc from './DepositLockedContent';
import './DepositLocked.scss';

const DepositLocked: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: settings } = useSettings();
    const { data: websiteStatus } = useQuery('website_status');
    const { data: authentication } = useAuthentication();
    const { data: cashierValidation } = useCashierValidation();
    const { data: status } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';
    const excludedUntil = activeWallet?.excluded_until;
    const isMFAccount = activeWallet?.loginid?.startsWith('MF') || false;

    const clientTncStatus = settings?.client_tnc_status;
    const websiteTncVersion = websiteStatus?.website_status?.terms_conditions_version;

    const poaNeedsVerification = authentication?.is_poa_needed;
    const poiNeedsVerification = authentication?.is_poa_needed;
    const poaStatus = authentication?.poa_status || 'none';
    const poiStatus = authentication?.poi_status || 'none';

    const askFixDetails = cashierValidation?.ask_fix_details;
    const selfExclusion = cashierValidation?.self_exclusion;
    const unwelcomeStatus = cashierValidation?.unwelcome_status;

    const isDepositLocked = status?.is_deposit_locked;
    const financialInformationNotComplete = status?.is_financial_information_not_complete;
    const tradingExperienceNotComplete = status?.is_trading_experience_not_complete;

    if (isDepositLocked) {
        return (
            <div className='wallets-deposit-locked'>
                <WalletsActionScreen
                    description={
                        getDepositLockedDesc({
                            askFixDetails,
                            clientTncStatus,
                            excludedUntil,
                            financialInformationNotComplete,
                            isMFAccount,
                            poaNeedsVerification,
                            poaStatus,
                            poiNeedsVerification,
                            poiStatus,
                            selfExclusion,
                            tradingExperienceNotComplete,
                            unwelcomeStatus,
                            websiteTncVersion,
                        })?.description
                    }
                    title={
                        <Trans
                            defaults='Deposits into your {{currency}} Wallet are temporarily locked.'
                            values={{ currency }}
                        />
                    }
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default DepositLocked;
