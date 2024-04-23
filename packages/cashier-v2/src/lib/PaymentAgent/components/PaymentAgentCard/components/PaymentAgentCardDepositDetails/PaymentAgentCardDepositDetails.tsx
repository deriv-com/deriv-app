import React from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import TransferLimitIcon from '../../../../../../assets/images/ic-account-transfer.svg';
import DepositIcon from '../../../../../../assets/images/ic-cashier-add.svg';
import WithdrawalIcon from '../../../../../../assets/images/ic-cashier-minus.svg';
import PhoneIcon from '../../../../../../assets/images/ic-phone.svg';
import type { THooks } from '../../../../../../hooks/types';
import { TCurrency } from '../../../../../../types';
import { PaymentAgentCardDetail } from '../PaymentAgentCardDetail';
import styles from './PaymentAgentCardDepositDetails.module.scss';

type TPaymentAgentCardDepositDetailsProps = {
    paymentAgent: THooks.PaymentAgentList[number];
};

type TPaymentAgentPhoneDetailsProps = {
    phoneNumbers: THooks.PaymentAgentList[number]['phone_numbers'];
};

type TPaymentAgentTransferLimitDetailsProps = {
    currency: TCurrency;
    maxWithdrawal: THooks.PaymentAgentList[number]['max_withdrawal'];
    minWithdrawal: THooks.PaymentAgentList[number]['min_withdrawal'];
};

type TPaymentAgentDepositCommissionDetailsProps = {
    depositCommission: THooks.PaymentAgentList[number]['deposit_commission'];
};

type TPaymentAgentWithdrawalCommissionDetailsProps = {
    withdrawalCommission: THooks.PaymentAgentList[number]['withdrawal_commission'];
};

const PaymentAgentPhoneDetails: React.FC<TPaymentAgentPhoneDetailsProps> = ({ phoneNumbers }) => {
    return (
        <PaymentAgentCardDetail action='tel' icon={PhoneIcon} title='Phone number'>
            {phoneNumbers.map(phone => phone.phone_number)}
        </PaymentAgentCardDetail>
    );
};

const PaymentAgentTransferLimitDetails: React.FC<TPaymentAgentTransferLimitDetailsProps> = ({
    currency,
    maxWithdrawal,
    minWithdrawal,
}) => {
    const { isMobile } = useDevice();
    return (
        <PaymentAgentCardDetail icon={TransferLimitIcon} title='Transfer limit'>
            <React.Fragment>
                {`${FormatUtils.formatMoney(Number(minWithdrawal), { currency })} ${currency}`}
                <Text size={isMobile ? 'md' : 'sm'}> - </Text>
                {`${FormatUtils.formatMoney(Number(maxWithdrawal), { currency })} ${currency}`}
            </React.Fragment>
        </PaymentAgentCardDetail>
    );
};

const PaymentAgentDepositCommissionDetails: React.FC<TPaymentAgentDepositCommissionDetailsProps> = ({
    depositCommission,
}) => {
    return (
        <PaymentAgentCardDetail icon={DepositIcon} title='Commission on deposits'>
            {`${depositCommission}%`}
        </PaymentAgentCardDetail>
    );
};

const PaymentAgentWithdrawalCommissionDetails: React.FC<TPaymentAgentWithdrawalCommissionDetailsProps> = ({
    withdrawalCommission,
}) => {
    return (
        <PaymentAgentCardDetail icon={WithdrawalIcon} title='Commission on withdrawal'>
            {`${withdrawalCommission}%`}
        </PaymentAgentCardDetail>
    );
};

const PaymentAgentCardDepositDetails: React.FC<TPaymentAgentCardDepositDetailsProps> = ({ paymentAgent }) => {
    const {
        currencies: currency,
        deposit_commission: depositCommission,
        max_withdrawal: maxWithdrawal,
        min_withdrawal: minWithdrawal,
        phone_numbers: phoneNumbers,
        withdrawal_commission: withdrawalCommission,
    } = paymentAgent;

    return (
        <div className={styles.container}>
            {phoneNumbers.length > 0 && <PaymentAgentPhoneDetails phoneNumbers={phoneNumbers} />}
            {minWithdrawal && maxWithdrawal && (
                <PaymentAgentTransferLimitDetails
                    currency={currency as TCurrency}
                    maxWithdrawal={maxWithdrawal}
                    minWithdrawal={minWithdrawal}
                />
            )}
            {depositCommission && <PaymentAgentDepositCommissionDetails depositCommission={depositCommission} />}
            {withdrawalCommission && (
                <PaymentAgentWithdrawalCommissionDetails withdrawalCommission={withdrawalCommission} />
            )}
        </div>
    );
};

export default PaymentAgentCardDepositDetails;
