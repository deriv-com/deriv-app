import React from 'react';
import { Trans } from 'react-i18next';
import { WalletText } from '../../../../components';
import { getStaticUrl } from '../../../../helpers/urls';

type TGetMessage = {
    currency: string;
    description: string;
    hasStaticUrl?: boolean;
    link?: string;
    liveChat?: boolean;
    values?: Date;
};

type TDepositLockedProps = {
    askFixDetails: boolean;
    clientTncStatus?: string | null;
    currency: string;
    excludedUntil?: Date;
    financialInformationNotComplete: boolean;
    isMFAccount: boolean;
    poaNeedsVerification: boolean;
    poaStatus: string;
    poiNeedsVerification: boolean;
    poiStatus: string;
    selfExclusion: boolean;
    tradingExperienceNotComplete: boolean;
    unwelcomeStatus: boolean;
    websiteTncVersion?: string;
};

const getMessage = ({ currency, description, hasStaticUrl = false, link, liveChat = false, values }: TGetMessage) => ({
    description: liveChat ? (
        <WalletText align='center'>
            <Trans
                components={[
                    <button
                        className='wallets-deposit-locked-link'
                        key={0}
                        onClick={() => window.LC_API.open_chat_window()}
                    />,
                ]}
                defaults={description}
                values={{ values }}
            />
        </WalletText>
    ) : (
        <WalletText align='center'>
            <Trans
                components={[
                    hasStaticUrl ? (
                        <a className='wallets-deposit-locked-link' href={getStaticUrl(link)} key={0} />
                    ) : (
                        <a className='wallets-deposit-locked-link' href={link} key={0} />
                    ),
                ]}
                defaults={description}
            />
        </WalletText>
    ),
    title: <Trans defaults='Deposits into your {{currency}} Wallet are temporarily locked.' values={{ currency }} />,
});

const getDepositLockedContent = ({
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
}: TDepositLockedProps) => {
    if (poiNeedsVerification && poiStatus !== 'none')
        return getMessage({
            currency,
            description:
                'To enable deposits, you must check your <0>proof of identity document verification status</0>.',
            link: '/account/proof-of-identity',
        });

    if (poaNeedsVerification && poaStatus !== 'none')
        return getMessage({
            currency,
            description:
                'To enable deposits, you must check your <0>proof of address document verification status</0>.',
            link: '/account/proof-of-address',
        });

    if (clientTncStatus !== websiteTncVersion)
        return getMessage({
            currency,
            description: 'To enable deposits, you must accept our <0>updated terms and conditions</0>.',
            hasStaticUrl: true,
            link: '/terms-and-conditions/#clients',
        });

    if (isMFAccount && (financialInformationNotComplete || tradingExperienceNotComplete))
        return getMessage({
            currency,
            description: 'To enable deposits, you must complete the <0>financial assessment form</0>.',
            link: '/account/financial-assessment',
        });

    if (askFixDetails)
        return getMessage({
            currency,
            description:
                'Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.',
            link: '/account/personal-details',
        });

    if (selfExclusion)
        return getMessage({
            currency,
            description:
                'You have chosen to exclude yourself from trading on our website until {{values}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via <0>live chat</0>.',
            liveChat: true,
            values: excludedUntil,
        });

    if (unwelcomeStatus)
        return getMessage({
            currency,
            description: 'Please contact us via <0>live chat</0>.',
            liveChat: true,
        });
};

export default getDepositLockedContent;
