import React from 'react';
import { Trans } from 'react-i18next';
import { WalletText } from '../../../../components';

type TGetMessage = {
    currency: string;
    description: string;
    hasSecondLink?: boolean;
    link?: string;
    liveChat?: boolean;
    secondLink?: string;
};

type TWithdrawalLockedProps = {
    askAuthenticate: boolean;
    askFinancialRiskApproval: boolean;
    askFixDetails: boolean;
    currency: string;
    financialAssessmentRequired: boolean;
    noWithdrawalOrTradingStatus: boolean;
    poaNeedsVerification: boolean;
    poaStatus: string;
    poiNeedsVerification: boolean;
    poiStatus: string;
    withdrawalLimitReached: boolean;
    withdrawalLockedStatus: boolean;
};

const getMessage = ({
    currency,
    description,
    hasSecondLink = false,
    link,
    liveChat = false,
    secondLink,
}: TGetMessage) => ({
    description: liveChat ? (
        <WalletText align='center'>
            <Trans
                components={[
                    <button
                        className='wallets-withdrawal-locked-link'
                        key={0}
                        onClick={() => window.LC_API.open_chat_window()}
                    />,
                ]}
                defaults={description}
            />
        </WalletText>
    ) : (
        <WalletText align='center'>
            <Trans
                components={
                    hasSecondLink
                        ? [
                              <a className='wallets-withdrawal-locked-link' href={link} key={0} />,
                              <a className='wallets-withdrawal-locked-link' href={secondLink} key={1} />,
                          ]
                        : [<a className='wallets-withdrawal-locked-link' href={link} key={0} />]
                }
                defaults={description}
            />
        </WalletText>
    ),
    title: <Trans defaults='Withdrawals from your {{currency}} Wallet are temporarily locked.' values={{ currency }} />,
});

const getWithdrawalLockedContent = ({
    askAuthenticate,
    askFinancialRiskApproval,
    askFixDetails,
    currency,
    financialAssessmentRequired,
    noWithdrawalOrTradingStatus,
    poaNeedsVerification,
    poaStatus,
    poiNeedsVerification,
    poiStatus,
    withdrawalLimitReached,
    withdrawalLockedStatus,
}: TWithdrawalLockedProps) => {
    if (withdrawalLimitReached && poiNeedsVerification && poiStatus === 'none')
        return getMessage({
            currency,
            description:
                'You have reached the withdrawal limit. Please upload your <0>proof of identity</0> to lift the limit to continue your withdrawal.',
            link: '/account/proof-of-identity',
        });

    if (withdrawalLimitReached && poiNeedsVerification && poiStatus !== 'verified' && poiStatus !== 'none')
        return getMessage({
            currency,
            description:
                'You have reached the withdrawal limit. Please check your <0>proof of identity</0> document verification status to lift the limit to continue your withdrawal.',
            link: '/account/proof-of-identity',
        });

    if (withdrawalLimitReached && poaNeedsVerification && poaStatus === 'none')
        return getMessage({
            currency,
            description:
                'You have reached the withdrawal limit. Please upload your <0>proof of address</0> to lift the limit to continue your withdrawal.',
            link: '/account/proof-of-address',
        });

    if (withdrawalLimitReached && poaNeedsVerification && poaStatus !== 'verified' && poaStatus !== 'none')
        return getMessage({
            currency,
            description:
                'You have reached the withdrawal limit. Please check your <0>proof of address</0> document verification status to lift the limit to continue your withdrawal.',
            link: '/account/proof-of-address',
        });

    if (withdrawalLimitReached && askFinancialRiskApproval)
        return getMessage({
            currency,
            description:
                'You have reached the withdrawal limit. Please complete the <0>financial assessment form</0> to lift the limit to continue your withdrawal.',
            link: '/account/financial-assessment',
        });

    if (financialAssessmentRequired)
        return getMessage({
            currency,
            description:
                'You can only make deposits. Please complete the <0>financial assessment</0> to unlock withdrawals.',
            link: '/account/financial-assessment',
        });

    if (askAuthenticate)
        return getMessage({
            currency,
            description:
                'Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.',
            hasSecondLink: true,
            link: '/account/proof-of-identity',
            secondLink: '/account/proof-of-address',
        });

    if (askFixDetails)
        return getMessage({
            currency,
            description:
                'Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.',
            link: '/account/personal-details',
        });

    if (noWithdrawalOrTradingStatus || withdrawalLockedStatus)
        return getMessage({
            currency,
            description:
                'Unfortunately, you can only make deposits. Please contact us via <0>live chat</0> to enable withdrawals.',
            liveChat: true,
        });
};

export default getWithdrawalLockedContent;
