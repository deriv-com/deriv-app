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

const generateDescription = (description: string, components?: JSX.Element[]) => (
    <WalletText align='center'>
        <Trans components={components} defaults={description} />
    </WalletText>
);

export const getWithdrawalLimitReachedDesc = ({
    askFinancialRiskApproval,
    poaNeedsVerification,
    poaStatus,
    poiNeedsVerification,
    poiStatus,
}: TWithdrawalLimitReachedDescProps) => {
    let description = null;

    if (poiNeedsVerification || poaNeedsVerification || poaStatus !== 'verified' || poiStatus !== 'verified') {
        description = generateDescription(
            'You have reached the withdrawal limit. Please check your <0>proof of identity</0> and <1>address</1> document verification status to lift the limit to continue your withdrawal.',
            [
                <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
            ]
        );
    } else if (askFinancialRiskApproval) {
        description = generateDescription(
            'Please complete the <0>financial assessment form</0> to lift the limit to continue your withdrawal.',
            [<WalletLink href='/account/financial-assessment' key={0} variant='bold' />]
        );
    }

    return description;
};

const getWithdrawalLockedDesc = ({
    askAuthenticate,
    askFixDetails,
    financialAssessmentRequired,
    noWithdrawalOrTradingStatus,
    withdrawalLockedStatus,
}: TWithdrawalLockedDescProps) => {
    let description = null;

    if (financialAssessmentRequired) {
        description = generateDescription('Please complete the <0>financial assessment</0> to unlock withdrawals.', [
            <WalletLink href='/account/financial-assessment' key={0} variant='bold' />,
        ]);
    } else if (askAuthenticate) {
        description = generateDescription(
            'Your account has not been authenticated. Please submit your <0>proof of identity</0> and <1>proof of address</1> to authenticate your account and request for withdrawals.',
            [
                <WalletLink href='/account/proof-of-identity' key={0} variant='bold' />,
                <WalletLink href='/account/proof-of-address' key={1} variant='bold' />,
            ]
        );
    } else if (askFixDetails) {
        description = generateDescription(
            'Your <0>personal details</0> are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.',
            [<WalletLink href='/account/personal-details' key={0} variant='bold' />]
        );
    } else if (noWithdrawalOrTradingStatus || withdrawalLockedStatus) {
        description = generateDescription(
            'Unfortunately, you can only make deposits. Please contact us via <0>live chat</0> to enable withdrawals.',
            [
                <button
                    className='wallets-link wallets-link__variant--bold'
                    key={0}
                    onClick={() => window.LC_API.open_chat_window()}
                />,
            ]
        );
    }

    return description;
};

export default getWithdrawalLockedDesc;
