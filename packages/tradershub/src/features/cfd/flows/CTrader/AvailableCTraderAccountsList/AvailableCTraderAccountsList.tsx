import React, { Fragment, useEffect, useState } from 'react';
import {
    GetADerivAccountDialog,
    IconComponent,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '@/components';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useRegulationFlags } from '@/hooks';
import { useModal } from '@/providers';
import { PlatformDetails } from '@cfd/constants';
import { CTraderSuccessModal } from '@cfd/modals';
import { useActiveTradingAccount, useCreateOtherCFDAccount } from '@deriv/api-v2';
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

const AvailableCTraderAccountsList = () => {
    const { mutate, status } = useCreateOtherCFDAccount();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { hasActiveDerivAccount } = useRegulationFlags();
    const { show } = useModal();

    const accountType = activeTradingAccount?.is_virtual ? 'demo' : 'real';
    const title = getCfdsAccountTitle(PlatformDetails.ctrader.title, activeTradingAccount?.is_virtual);

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
                <TradingAccountCardContent title={title}>
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
