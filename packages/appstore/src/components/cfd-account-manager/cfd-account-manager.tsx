import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { formatMoney, CFD_PLATFORMS } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { TPlatform } from 'Types';

type TCFDAccountManager = {
    type: string;
    amount: string;
    appname: string;
    loginid: string;
    platform: TPlatform;
    currency: string;
    onClickTopUp: () => void;
    onClickTrade: () => void;
};

const CFDAccountManager = ({
    type,
    amount,
    appname,
    loginid,
    currency,
    platform,
    onClickTopUp,
    onClickTrade,
}: TCFDAccountManager) => {
    return (
        <div className='cfd-account-manager'>
            <div className='cfd-account-manager__icon'>
                {platform === CFD_PLATFORMS.MT5 &&
                    (type === 'financial' ? (
                        <Icon icon='IcAppstoreFinancial' size={64} />
                    ) : (
                        <Icon icon='IcAppstoreDerived' size={64} />
                    ))}
                {platform === CFD_PLATFORMS.DXTRADE && <Icon icon='IcAppstoreDerivx' size={64} />}
            </div>
            <div className='cfd-account-manager__details'>
                <Text size='xs'>{appname}</Text>
                <Text size='xs'>{`${formatMoney(currency, amount, true)} ${currency}`}</Text>
                <Text size='xs'>{loginid}</Text>
            </div>
            <div className='cfd-account-manager-buttons'>
                <Button primary className='cfd-account-manager__buttons-topup' onClick={onClickTopUp}>
                    <Localize i18n_default_text='Top-up' />
                </Button>
                <Button secondary onClick={onClickTrade}>
                    <Localize i18n_default_text='Trade' />
                </Button>
            </div>
        </div>
    );
};

export default CFDAccountManager;
