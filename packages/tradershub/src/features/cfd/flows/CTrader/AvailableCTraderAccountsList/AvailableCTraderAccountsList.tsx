import React from 'react';
import { useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/cfd/ctrader.svg';
import { PlatformDetails } from '../../../constants';

const AvailableCTraderAccountsList = () => {
    const { mutate } = useCreateOtherCFDAccount();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const accountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: PlatformDetails.ctrader.platform,
            },
        });
    };

    const LeadingIcon = () => (
        <div
            className='cursor-pointer'
            onClick={() => {
                window.open(getStaticUrl('/deriv-ctrader'));
            }}
            // Fix sonarcloud issue
            onKeyDown={event => {
                if (event.key === 'Enter') {
                    window.open(getStaticUrl('/deriv-ctrader'));
                }
            }}
        >
            <CTrader />
        </div>
    );

    const TrailingButton = () => <TradingAccountCardLightButton onSubmit={onSubmit} />;

    return (
        <div>
            <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
                <TradingAccountCardContent title={PlatformDetails.ctrader.title}>
                    This account offers CFDs on a feature-rich trading platform.
                </TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default AvailableCTraderAccountsList;
