import React, { useEffect } from 'react';
import { useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { Provider } from '@deriv/library';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../helpers/urls';
import CTrader from '../../../../../public/images/cfd/ctrader.svg';
import { PlatformDetails } from '../../../constants';
import { CTraderSuccessModal } from '../../../modals';

const LeadingIcon = () => (
    <button
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
    </button>
);

const AvailableCTraderAccountsList = () => {
    const { mutate, status } = useCreateOtherCFDAccount();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { show } = Provider.useModal();

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

    useEffect(() => {
        if (status === 'success') {
            show(<CTraderSuccessModal isDemo={accountType === 'demo'} />);
        }
    }, [accountType, show, status]);

    return (
        <div>
            <TradingAccountCard
                leading={LeadingIcon}
                trailing={() => <TradingAccountCardLightButton onSubmit={onSubmit} />}
            >
                <TradingAccountCardContent title={PlatformDetails.ctrader.title}>
                    This account offers CFDs on a feature-rich trading platform.
                </TradingAccountCardContent>
            </TradingAccountCard>
        </div>
    );
};

export default AvailableCTraderAccountsList;
