import React, { Fragment, useEffect, useState } from 'react';
import {
    GetADerivAccountDialog,
    IconComponent,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '@/components';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useUIContext } from '@/providers';
import { PlatformDetails } from '@cfd/constants';
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
    const { setUIState } = useUIContext();
    const { openModal } = useQueryParams();

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
            setUIState({ accountType });
            openModal('CTraderSuccessModal');
        }
    }, [accountType, openModal, setUIState, status]);

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
