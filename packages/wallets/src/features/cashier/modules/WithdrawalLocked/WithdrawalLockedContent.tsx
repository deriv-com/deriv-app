import React from 'react';
import { Trans } from 'react-i18next';
import { WalletLink, WalletText } from '../../../../components';

type TWithdrawalLimitReachedDescProps = {
    askFinancialRiskApproval?: boolean;
    poaNeedsVerification?: boolean;
    poaStatus: string;
    poiNeedsVerification?: boolean;
    poiStatus: string;
};

type TWithdrawalLockedDescProps = {
    askAuthenticate?: boolean;
    askFixDetails?: boolean;
    financialAssessmentRequired?: boolean;
    noWithdrawalOrTradingStatus?: boolean;
    withdrawalLockedStatus?: boolean;
};

export const getWithdrawalLimitReachedDesc = ({
    askFinancialRiskApproval,
    poaNeedsVerification,
    poaStatus,
    poiNeedsVerification,
    poiStatus,
}: TWithdrawalLimitReachedDescProps) => {
    if (poiNeedsVerification && poiStatus === 'none')
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]}
                        defaults='You have reached the withdrawal limit. Please upload your <0>proof of identity</0> to lift the limit to continue your withdrawal.'
                    />
                </WalletText>
            ),
        };

    if (poiNeedsVerification && poiStatus !== 'verified' && poiStatus !== 'none')
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]}
                        defaults='You have reached the withdrawal limit. Please check your <0>proof of identity</0> document verification status to lift the limit to continue your withdrawal.'
                    />
                </WalletText>
            ),
        };

    if (poaNeedsVerification && poaStatus === 'none')
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-address' key={0} variant='bold' />]}
                        defaults='You have reached the withdrawal limit. Please upload your <0>proof of address</0> to lift the limit to continue your withdrawal.'
                    />
                </WalletText>
            ),
        };

    if (poaNeedsVerification && poaStatus !== 'verified' && poaStatus !== 'none')
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-address' key={0} variant='bold' />]}
                        defaults='You have reached the withdrawal limit. Please check your <0>proof of address</0> document verification status to lift the limit to continue your withdrawal.'
                    />
                </WalletText>
            ),
        };

    if (askFinancialRiskApproval)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                        defaults='You have reached the withdrawal limit. Please complete the <0>financial assessment form</0> to lift the limit to continue your withdrawal.'
                    />
                </WalletText>
            ),
        };
};

const getWithdrawalLockedDesc = ({
    askAuthenticate,
    askFixDetails,
    financialAssessmentRequired,
    noWithdrawalOrTradingStatus,
    withdrawalLockedStatus,
}: TWithdrawalLockedDescProps) => {
    if (financialAssessmentRequired)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                        defaults='Please complete the <0>financial assessment</0> to unlock withdrawals.'
                    />
                </WalletText>
            ),
        };

    if (askAuthenticate)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[
                            <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                            <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
                        ]}
                        defaults='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.'
                    />
                </WalletText>
            ),
        };

    if (askFixDetails)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                        defaults='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.'
                    />
                </WalletText>
            ),
        };

    if (noWithdrawalOrTradingStatus || withdrawalLockedStatus)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[
                            <button
                                className='wallets-link wallets-link__variant--bold'
                                key={0}
                                onClick={() => window.LC_API.open_chat_window()}
                            />,
                        ]}
                        defaults='Unfortunately, you can only make deposits. Please contact us via <0>live chat</0> to enable withdrawals.'
                    />
                </WalletText>
            ),
        };
};

export default getWithdrawalLockedDesc;
