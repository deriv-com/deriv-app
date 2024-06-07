import React, { Fragment } from 'react';
import { IconComponent, TradingAccountCard } from '@/components';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useQueryParams } from '@/hooks';
import { useCFDContext } from '@/providers';
import { CFDPlatforms, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import { URLUtils } from '@deriv-com/utils';

const { getDerivStaticURL } = URLUtils;

const LeadingIcon = () => (
    <IconComponent
        icon='CTrader'
        onClick={() => {
            window.open(getDerivStaticURL('/deriv-ctrader'));
        }}
    />
);

const AddedCTraderAccountsList = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { openModal } = useQueryParams();
    const { setCfdState } = useCFDContext();
    const account = cTraderAccounts?.find(account => account.is_virtual === activeTradingAccount?.is_virtual);
    const isVirtual = account?.is_virtual;
    const title = getCfdsAccountTitle(PlatformDetails.ctrader.title, isVirtual);

    const trailing = () => (
        <div className='flex flex-col gap-y-4'>
            <Button
                // todo: open transfer modal
                color='black'
                onClick={() => {
                    if (isVirtual) {
                        setCfdState({
                            account,
                            platform: CFDPlatforms.CTRADER,
                        });
                        openModal('TopUpModal');
                    }

                    // else transferModal;
                }}
                variant='outlined'
            >
                {isVirtual ? 'Top up' : 'Transfer'}
            </Button>
            <Button
                onClick={() => {
                    setCfdState({
                        account,
                        marketType: account?.market_type,
                        platform: CFDPlatforms.CTRADER,
                    });
                    openModal('TradeModal');
                }}
            >
                Open
            </Button>
        </div>
    );

    return (
        <div>
            <TradingAccountCard leading={LeadingIcon} trailing={trailing}>
                <div className='flex flex-col flex-grow'>
                    {account && (
                        <Fragment>
                            <Text size='sm'>{title}</Text>
                            <Text size='sm' weight='bold'>
                                {account?.formatted_balance}
                            </Text>
                            <Text color='primary' size='sm'>
                                {account.login}
                            </Text>
                        </Fragment>
                    )}
                </div>
            </TradingAccountCard>
        </div>
    );
};

export default AddedCTraderAccountsList;
