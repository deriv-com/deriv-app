import React, { Fragment, useState } from 'react';
import {
    GetADerivAccountDialog,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '@/components';
import { getCfdsAccountTitle } from '@/helpers/cfdsAccountHelpers';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { useCFDContext } from '@/providers';
import { THooks } from '@/types';
import { MarketType, MarketTypeDetails, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { hasActiveDerivAccount, isEU } = useRegulationFlags();
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const description = marketTypeDetails?.description ?? '';
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { setCfdState } = useCFDContext();

    const { openModal } = useQueryParams();

    const [isDerivedAccountModalOpen, setIsDerivedAccountModalOpen] = useState(false);

    const trailingButtonClick = () => {
        setCfdState({ marketType: account.market_type, platform: PlatformDetails.mt5.platform });
        if (!hasActiveDerivAccount) {
            setIsDerivedAccountModalOpen(true);
        }
        !activeTradingAccount?.is_virtual && openModal('JurisdictionModal');
        activeTradingAccount?.is_virtual && hasActiveDerivAccount && openModal('MT5PasswordModal');
    };
    const title = getCfdsAccountTitle(marketTypeDetails.title, activeTradingAccount?.is_virtual);

    return (
        <Fragment>
            <TradingAccountCard
                leading={() => <MT5AccountIcon account={account} />}
                trailing={() => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />}
            >
                <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
            </TradingAccountCard>
            <GetADerivAccountDialog
                isOpen={isDerivedAccountModalOpen}
                onClose={() => setIsDerivedAccountModalOpen(false)}
            />
        </Fragment>
    );
};

export default AvailableMT5AccountsList;
