import React from 'react';
import { useRequest } from '@deriv/api';
import { Icon, Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import './funds-protection.scss';

const FundsProtection = () => {
    const { mutate } = useRequest('tnc_approval', { onSuccess: () => location.reload() });

    return (
        <div className='funds-protection'>
            <Icon icon='IcCashierFundsProtection' className='funds-protection__icon' />
            <Text as='h2' weight='bold' align='center' className='funds-protection__title'>
                {localize('Funds protection level')}
            </Text>
            <p className='funds-protection__desc'>
                {
                    <Localize
                        i18n_default_text="We hold customer funds in bank accounts separate from our operational accounts which would not, in the event of insolvency, form part of the company's assets. This meets the <0>Gambling Commission</0>'s requirements for the segregation of customer funds at the level: <1>medium protection</1>."
                        components={[
                            <a
                                key={0}
                                className='link link--orange'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://www.gamblingcommission.gov.uk/for-the-public/Your-rights/Protection-of-customer-funds.aspx'
                            />,
                            <strong key={1} />,
                        ]}
                    />
                }
            </p>
            <Button onClick={() => mutate({ payload: { ukgc_funds_protection: 1 } })} primary large type='submit'>
                {localize('Deposit now')}
            </Button>
        </div>
    );
};

export default FundsProtection;
