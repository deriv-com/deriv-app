import React from 'react';
import classNames from 'classnames';
import Error from '../../public/images/alert-danger.svg';
import AlertInfo from '../../public/images/alert-info.svg';
import Warning from '../../public/images/warning.svg';
import { THooks } from '../../types';
import { WalletText } from '../Base';
import './VerificationStatusBadge.scss';

type StatusBadgeProps = {
    accountStatus: THooks.Authentication['poa_status' | 'poi_status'];
};

const accountStatusMapper = {
    needs_verification: {
        color: 'blue',
        icon: <AlertInfo />,
        text: (
            <span>
                Needs verification.{' '}
                <a href='/account/proof-of-identity' style={{ color: '#377cfc' }}>
                    Verify now.
                </a>
            </span>
        ),
    },
    pending: {
        color: 'warning',
        icon: <Warning />,
        text: 'Pending verification',
    },
    rejected: {
        color: 'red',
        icon: <Error />,
        text: (
            <span>
                Verification failed.{' '}
                <a href='/account/proof-of-identity' style={{ color: '#ec3f3f' }}>
                    Why?.
                </a>
            </span>
        ),
    },
};

const VerificationStatusBadge: React.FC<StatusBadgeProps> = ({ accountStatus }) => {
    const status = accountStatusMapper[accountStatus as keyof typeof accountStatusMapper];

    if (!status || !status.color) {
        return null;
    }

    const { color, icon, text } = accountStatusMapper[accountStatus as keyof typeof accountStatusMapper];

    return (
        <div
            className={classNames('wallets-verification-status-badge', {
                [`wallets-verification-status-badge--${accountStatus}`]: accountStatus,
            })}
        >
            {icon}
            <WalletText color={color || 'blue'} size='xs' weight='bold'>
                {text}
            </WalletText>
        </div>
    );
};

export default VerificationStatusBadge;
