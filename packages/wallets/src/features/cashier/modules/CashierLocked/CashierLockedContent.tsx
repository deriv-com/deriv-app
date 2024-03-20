import React from 'react';
import { Trans } from 'react-i18next';
import { WalletLink, WalletText } from '../../../../components';

type TSystemMaintenanceDescProps = {
    currency?: string;
    isCashierLocked?: boolean;
    isCrypto?: boolean;
    isDepositLocked?: boolean;
    isWithdrawalLocked?: boolean;
};

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

export const getSystemMaintenanceContent = ({
    currency,
    isCashierLocked,
    isCrypto,
    isDepositLocked,
    isWithdrawalLocked,
}: TSystemMaintenanceDescProps) => {
    let content = null;
    const generateContent = (description: string, title: string) => ({
        description: (
            <WalletText align='center'>
                <Trans defaults={description} values={{ currency }} />
            </WalletText>
        ),
        title: <Trans defaults={title} values={{ currency }} />,
    });

    if (isCashierLocked) {
        content = generateContent(
            'Due to system maintenance, deposits and withdrawals with your {{currency}} Wallet are unavailable at the moment. Please try again later.',
            '{{currency}} Wallet deposits and withdrawals are temporarily unavailable.'
        );
    }

    if (isCrypto) {
        if (isDepositLocked) {
            content = generateContent(
                'Due to system maintenance, deposits into your {{currency}} Wallet are unavailable at the moment. Please try again later.',
                '{{currency}} Wallet deposits are temporarily unavailable.'
            );
        }

        if (isWithdrawalLocked) {
            content = generateContent(
                'Due to system maintenance, withdrawals from your {{currency}} Wallet are unavailable at the moment. Please try again later.',
                '{{currency}} Wallet withdrawals are temporarily unavailable.'
            );
        }
    }

    return content;
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
    let description = null;
    const generateDescription = (description: string, components?: JSX.Element[]) => (
        <WalletText align='center'>
            <Trans components={components} defaults={description} values={{ currency }} />
        </WalletText>
    );

    if (noResidence) {
        description = generateDescription(
            "You've not set your country of residence. To access {{currency}} Wallet, please update your country of residence in the <0>Personal details section</0> in your account settings.",
            [<WalletLink href='/account/personal-details' key={0} variant='bold' />]
        );
    }

    if (documentsExpired) {
        description = generateDescription(
            'The identification documents you submitted have expired. Please submit valid identity documents to unlock your {{currency}} Wallet.'
        );
    }

    if (cashierLockedStatus) {
        description = generateDescription(
            'Please contact us via <0>live chat</0> to enable deposits and withdrawals again.',
            [
                <button
                    className='wallets-link wallets-link__variant--bold'
                    key={0}
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ]
        );
    }

    if (disabledStatus) {
        description = generateDescription(
            'Please contact us via <0>live chat</0> to enable deposits and withdrawals again.',
            [
                <button
                    className='wallets-link wallets-link__variant--bold'
                    key={0}
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ]
        );
    }

    if (askCurrency) {
        description = generateDescription('Please set your account currency to enable deposits and withdrawals.');
    }

    if (askAuthenticate && poiNeedsVerification) {
        if (poaNeedsVerification) {
            description = generateDescription(
                'Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and access your {{currency}} Wallet.',
                [
                    <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                    <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
                ]
            );
        }

        if (!poaNeedsVerification) {
            description = generateDescription(
                'Please submit your <0>proof of identity</0> to authenticate your account and access your {{currency} Wallet.',
                [<WalletLink href='/account/proof-of-identity' key={0} variant='bold' />]
            );
        }
    }

    if (askFinancialRiskApproval) {
        description = generateDescription(
            'Please complete the <0>Appropriateness Test</0> to access your {{currency}} Wallet.',
            [<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]
        );
    }

    if (financialAssessmentRequired) {
        description = generateDescription('Please complete the <0>financial assessment</0> to unlock it.', [
            <WalletLink href='/account/financial-assessment' key={0} variant='bold' />,
        ]);
    }

    if (askTinInformation) {
        description = generateDescription(
            'You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to <0>Personal details</0> in your account settings and fill in your latest tax identification number.',
            [<WalletLink href='/account/personal-details' key={0} variant='bold' />]
        );
    }

    if (askSelfExclusionMaxTurnoverSet) {
        description = generateDescription(
            'Your access to {{currency}} Wallet has been temporarily disabled as you have not set your 30-day turnover limit. Please go to <0>Self-exclusion</0> and set your 30-day turnover limit.',
            [<WalletLink href='/account/self-exclusion' key={0} variant='bold' />]
        );
    }

    if (askFixDetails) {
        description = generateDescription(
            'Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.',
            [<WalletLink href='/account/personal-details' key={0} variant='bold' />]
        );
    }

    return description;
};

export default getCashierLockedDesc;
