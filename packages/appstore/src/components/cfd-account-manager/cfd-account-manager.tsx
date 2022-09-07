import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney } from '@deriv/shared';

type TCFDAccountManager = {
    appname: string;
    platform: string;
    amount: string;
    currency: string;
    loginid: string;
    onClickTopUp: () => void;
    onClickTrade: () => void;
};

const CFDAccountManager = ({
    appname,
    amount,
    currency,
    loginid,
    platform,
    onClickTopUp,
    onClickTrade,
}: TCFDAccountManager) => {
    return (
        <div className='cfd-account-manager'>
            <div className='cfd-account-manager-icon'>
                {platform === 'financial' ? (
                    <Icon icon='IcAppstoreFinancial' size={64} />
                ) : (
                    <Icon icon='IcAppstoreDerived' size={64} />
                )}
            </div>
            <div className='cfd-account-manager-details'>
                <Text size='xs'>{appname}</Text>
                <Text size='xs'>{`${formatMoney(currency, amount, true)} ${currency}`}</Text>
                <Text size='xs'>{loginid}</Text>
            </div>
            <div className='cfd-account-manager-buttons'>
                <Button primary className='cfd-account-manager-buttons-topup' onClick={onClickTopUp}>
                    Top-up
                </Button>
                <Button secondary onClick={onClickTrade}>
                    Trade
                </Button>
            </div>
        </div>
    );
};

export default CFDAccountManager;
