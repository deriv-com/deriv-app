import React from 'react';
import { Trans } from 'react-i18next';
import { WalletLink, WalletText } from '../../../../components';

type TCashierLockedDescProps = {
    askAuthenticate?: boolean;
    askCurrency?: boolean;
    askFinancialRiskApproval?: boolean;
    askFixDetails?: boolean;
    askSelfExclusionMaxTurnoverSet?: boolean;
    askTinInformation?: boolean;
    cashierLockedStatus?: boolean;
    currency?: string;
    disabledStatus?: boolean;
    documentsExpired?: boolean;
    financialAssessmentRequired?: boolean;
    noResidence?: boolean;
    poaNeedsVerification?: boolean;
    poiNeedsVerification?: boolean;
};

const getCashierLockedDesc = ({
    askAuthenticate,
    askCurrency,
    askFinancialRiskApproval,
    askFixDetails,
    askSelfExclusionMaxTurnoverSet,
    askTinInformation,
    cashierLockedStatus,
    currency,
    disabledStatus,
    documentsExpired,
    financialAssessmentRequired,
    noResidence,
    poaNeedsVerification,
    poiNeedsVerification,
}: TCashierLockedDescProps) => {
    if (noResidence)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                        defaults="You've not set your country of residence. To access {{currency}} Wallet, please update your country of residence in the <0>Personal details section</0> in your account settings."
                        values={{ currency }}
                    />
                </WalletText>
            ),
        };

    if (documentsExpired)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        defaults='The identification documents you submitted have expired. Please submit valid identity documents to unlock your {{currency}} Wallet.'
                        values={{ currency }}
                    />
                </WalletText>
            ),
        };

    if (cashierLockedStatus)
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
                        defaults='Please contact us via <0>live chat</0> to enable deposits and withdrawals again.'
                    />
                </WalletText>
            ),
        };

    if (disabledStatus)
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
                        defaults='Please contact us via <0>live chat</0> to enable deposits and withdrawals again.'
                    />
                </WalletText>
            ),
        };

    if (askCurrency)
        return {
            description: (
                <WalletText align='center'>
                    <Trans defaults='Please set your account currency to enable deposits and withdrawals.' />
                </WalletText>
            ),
        };

    if (askAuthenticate && poiNeedsVerification) {
        if (poaNeedsVerification)
            return {
                description: (
                    <WalletText align='center'>
                        <Trans
                            components={[
                                <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                                <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
                            ]}
                            defaults='Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and access your {{currency}} Wallet.'
                            values={{ currency }}
                        />
                    </WalletText>
                ),
            };

        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]}
                        defaults='Please submit your <0>proof of identity</0> to authenticate your account and access your {{currency} Wallet.'
                        values={{ currency }}
                    />
                </WalletText>
            ),
        };
    }

    if (askFinancialRiskApproval)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                        defaults='Please complete the <0>Appropriateness Test</0> to access your {{currency}} Wallet.'
                        values={{ currency }}
                    />
                </WalletText>
            ),
        };

    if (financialAssessmentRequired)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]}
                        defaults='Please complete the <0>financial assessment</0> to unlock it.'
                    />
                </WalletText>
            ),
        };

    if (askTinInformation)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/personal-details' key={0} variant='bold' />]}
                        defaults='You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings and fill in your latest tax identification number.'
                    />
                </WalletText>
            ),
        };

    if (askSelfExclusionMaxTurnoverSet)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        components={[<WalletLink href='/account/self-exclusion' key={0} variant='bold' />]}
                        defaults='Your access to {{currency}} Wallet has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.'
                        values={{ currency }}
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
                        defaults='Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.'
                    />
                </WalletText>
            ),
        };
};

export default getCashierLockedDesc;
