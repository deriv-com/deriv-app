import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';

type TCFDAccountManager = {
    appname: string;
    amount: string;
    currency: string;
    loginid: string;
};

const CFDAccountManager = ({ appname, amount, currency, loginid }: TCFDAccountManager) => {
    return (
        <div className='cfd-account-manager'>
            <div className='cfd-account-manager-icon'>
                <Icon icon='IcCloseCircle' />
            </div>
            <div className='cfd-account-manager-details'>
                <Text size='xs'>{appname}</Text>
                <Text size='xs'>{`${formatMoney(currency, amount, true)} ${currency}`}</Text>
                <Text size='xs'>{loginid}</Text>
            </div>
            <div className='cfd-account-manager-buttons'>
                <Button primary className='cfd-account-manager-buttons-topup'>
                    Top-up
                </Button>
                <Button secondary>Trade</Button>
            </div>
        </div>
    );
};

export default CFDAccountManager;
