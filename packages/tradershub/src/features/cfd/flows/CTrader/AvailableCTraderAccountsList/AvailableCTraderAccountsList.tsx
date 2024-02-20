import React, { Fragment, useEffect, useState } from 'react';
import {
    GetADerivAccountDialog,
    PlatformIcon,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '@/components';
import { getStaticUrl } from '@/helpers';
import { useRegulationFlags } from '@/hooks';
import { PlatformDetails } from '@cfd/constants';
import { CTraderSuccessModal } from '@cfd/modals';
import { useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api';
import { Provider } from '@deriv/library';

const LeadingIcon = () => (
    <PlatformIcon
        icon='CTrader'
        onClick={() => {
            window.open(getStaticUrl('/deriv-ctrader'));
        }}
    />
);

const AvailableCTraderAccountsList = () => {
    const { mutate, status } = useCreateOtherCFDAccount();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { hasActiveDerivAccount } = useRegulationFlags();
    const { show } = Provider.useModal();

    const accountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';

    const [isDerivedAccountModalOpen, setIsDerivedAccountModalOpen] = useState(false);

    const onSubmit = () => {
        if (!hasActiveDerivAccount) {
            setIsDerivedAccountModalOpen(true);
        } else {
            mutate({
                payload: {
                    account_type: accountType,
                    market_type: 'all',
                    platform: PlatformDetails.ctrader.platform,
                },
            });
        }
    };

    useEffect(() => {
        if (status === 'success') {
            show(<CTraderSuccessModal isDemo={accountType === 'demo'} />);
        }
    }, [accountType, show, status]);

    return (
        <Fragment>
            <TradingAccountCard
                leading={LeadingIcon}
                trailing={() => <TradingAccountCardLightButton onSubmit={onSubmit} />}
            >
                <TradingAccountCardContent title={PlatformDetails.ctrader.title}>
                    This account offers CFDs on a feature-rich trading platform.
                </TradingAccountCardContent>
            </TradingAccountCard>
            <GetADerivAccountDialog
                isOpen={isDerivedAccountModalOpen}
                onClose={() => setIsDerivedAccountModalOpen(false)}
            />
        </Fragment>
    );
};

export default AvailableCTraderAccountsList;
