import React, { Fragment, useState } from 'react';
import {
    GetADerivAccountDialog,
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '@/components';
import { useRegulationFlags } from '@/hooks';
import { THooks } from '@/types';
import { MarketType, MarketTypeDetails, PlatformDetails } from '@cfd/constants';
import { JurisdictionModal, MT5PasswordModal } from '@cfd/modals';
import { useAuthorize } from '@deriv/api';
import { Provider } from '@deriv/library';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { hasActiveDerivAccount, isEU } = useRegulationFlags();
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const description = marketTypeDetails?.description ?? '';
    const { data: activeAccount } = useAuthorize();
    const { setCfdState } = Provider.useCFDContext();
    const { show } = Provider.useModal();

    const [isDerivedAccountModalOpen, setIsDerivedAccountModalOpen] = useState(false);

    const trailingButtonClick = () => {
        setCfdState('marketType', account.market_type);
        setCfdState('platform', PlatformDetails.mt5.platform);
        if (!hasActiveDerivAccount) {
            setIsDerivedAccountModalOpen(true);
        }
        !activeAccount?.is_virtual && show(<JurisdictionModal />);
        activeAccount?.is_virtual && hasActiveDerivAccount && show(<MT5PasswordModal />);
    };

    const title = marketTypeDetails?.title ?? '';

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
