import React from 'react';
import { useActiveWalletAccount, useQuery, useSettings } from '@deriv/api';
import { WalletsActionScreen } from '../../../../components';
import type { THooks } from '../../../../types';
import depositLockedProvider from './DepositLockedProvider';
import './DepositLocked.scss';

type TProps = {
    accountStatus: THooks.GetAccountStatus;
};

const DepositLocked: React.FC<React.PropsWithChildren<TProps>> = ({ accountStatus, children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: settings } = useSettings();
    const { data: websiteStatus } = useQuery('website_status');

    const authentication = accountStatus?.authentication;
    const cashierValidation = accountStatus?.cashier_validation;
    const status = accountStatus?.status;

    const askFixDetails = cashierValidation?.includes('ASK_FIX_DETAILS') || false;
    const clientTncStatus = settings?.client_tnc_status;
    const currency = activeWallet?.currency || 'USD';
    const excludedUntil = activeWallet?.excluded_until;
    const financialInformationNotComplete = status?.includes('financial_information_not_complete') || false;
    const isDepositLocked = status?.includes('deposit_locked');
    const isMFAccount = activeWallet?.loginid?.startsWith('MF') || false;
    const poaNeedsVerification = authentication?.needs_verification?.includes('document') || false;
    const poaStatus = authentication?.document?.status || 'none';
    const poiNeedsVerification = authentication?.needs_verification?.includes('identity') || false;
    const poiStatus = authentication?.identity?.status || 'none';
    const selfExclusion = cashierValidation?.includes('SelfExclusion') || false;
    const tradingExperienceNotComplete = status?.includes('trading_experience_not_complete') || false;
    const unwelcomeStatus = cashierValidation?.includes('unwelcome_status') || false;
    const websiteTncVersion = websiteStatus?.website_status?.terms_conditions_version;

    const state = isDepositLocked
        ? depositLockedProvider({
              askFixDetails,
              clientTncStatus,
              currency,
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
          })
        : undefined;

    if (state) {
        return (
            <div className='wallets-deposit-locked'>
                <WalletsActionScreen description={state?.description} title={state?.title} />
            </div>
        );
    }

    return <>{children}</>;
};

export default DepositLocked;
