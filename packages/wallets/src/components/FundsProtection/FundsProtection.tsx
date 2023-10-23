import React from 'react';
import { useMutation } from '@deriv/api';
import IcCashierFundsProtection from '../../public/images/ic-cashier-funds-protection.svg';
import WalletsActionScreen from '../WalletsActionScreen/WalletsActionScreen';

const FundsProtection: React.FC = () => {
    const { mutate } = useMutation('tnc_approval', { onSuccess: () => location.reload() });

    return (
        <WalletsActionScreen
            actionText='Deposit now'
            description={
                <p>
                    We hold customer funds in bank accounts separate from our operational accounts which would not, in
                    the event of insolvency, form part of the company&apos;s assets. This meets the{' '}
                    <a
                        className='link'
                        href='https://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx'
                        rel='noopener noreferrer'
                        target='_blank'
                    >
                        Gambling Commission&apos;s
                    </a>{' '}
                    requirements for the segregation of customer funds at the level: <strong>medium protection</strong>.
                </p>
            }
            icon={<IcCashierFundsProtection />}
            onAction={() => mutate({ payload: { ukgc_funds_protection: 1 } })}
            title='Funds protection level'
            variant='ghost'
        />
    );
};

export default FundsProtection;
