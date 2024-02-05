import React from 'react';
import { Trans } from 'react-i18next';
import { WalletLink, WalletText } from '../../../../components';

type TDepositLockedDescProps = {
    askFixDetails?: boolean;
    clientTncStatus?: string | null;
    excludedUntil?: Date;
    financialInformationNotComplete?: boolean;
    isMFAccount: boolean;
    poaNeedsVerification?: boolean;
    poaStatus: string;
    poiNeedsVerification?: boolean;
    poiStatus: string;
    selfExclusion?: boolean;
    tradingExperienceNotComplete?: boolean;
    unwelcomeStatus?: boolean;
    websiteTncVersion?: string;
};

const getDepositLockedDesc = ({
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
}: TDepositLockedDescProps) => {
    if (poiNeedsVerification && poiStatus !== 'none')
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]}
                        defaults='To enable deposits, you must check your <0>proof of identity document verification status</0>.'
                    />
                </WalletText>
            ),
        };

    if (poaNeedsVerification && poaStatus !== 'none')
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-address' key={0} variant='bold' />]}
                        defaults='To enable deposits, you must check your <0>proof of address document verification status</0>.'
                    />
                </WalletText>
            ),
        };

    if (clientTncStatus !== websiteTncVersion)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink key={0} staticUrl='/terms-and-conditions/#clients' variant='bold' />]}
                        defaults='To enable deposits, you must accept our <0>updated terms and conditions</0>.'
                    />
                </WalletText>
            ),
        };

    if (isMFAccount && (financialInformationNotComplete || tradingExperienceNotComplete))
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                        defaults='To enable deposits, you must complete the <0>financial assessment form</0>.'
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
                        defaults='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits.'
                    />
                </WalletText>
            ),
        };

    if (selfExclusion)
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
                        defaults='You have chosen to exclude yourself from trading on our website until {{excludedUntil}}. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via <0>live chat</0>.'
                        values={{ excludedUntil }}
                    />
                </WalletText>
            ),
        };

    if (unwelcomeStatus)
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
                        defaults='Please contact us via <0>live chat</0>.'
                    />
                </WalletText>
            ),
        };
};

export default getDepositLockedDesc;
