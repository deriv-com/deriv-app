import React from 'react';
import { useRequest } from '@deriv/api';
import { Localize, localize } from '@deriv/translations';
import { EmptyState } from '@deriv/components';

const FundsProtection = () => {
    const { mutate, isLoading } = useRequest('tnc_approval', { onSuccess: () => location.reload() });

    return (
        <EmptyState
            icon='IcCashierFundsProtection'
            title={localize('Funds protection level')}
            description={
                <Localize
                    i18n_default_text="We hold customer funds in bank accounts separate from our operational accounts which would not, in the event of insolvency, form part of the company's assets. This meets the <0>Gambling Commission</0>'s requirements for the segregation of customer funds at the level: <1>medium protection</1>."
                    components={[
                        <a
                            key={0}
                            className='link link--orange'
                            href='https://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx'
                            target='_blank'
                            rel='noopener noreferrer'
                        />,
                        <strong key={1} />,
                    ]}
                />
            }
            action={{
                label: localize('Deposit now'),
                disabled: isLoading,
                onClick: () => mutate({ payload: { ukgc_funds_protection: 1 } }),
            }}
        />
    );
};

export default FundsProtection;
