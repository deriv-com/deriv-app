import React from 'react';
import { useAuthorize } from '@deriv/api';
import { Provider } from '@deriv/library';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
    useUIContext,
} from '../../../../../components';
import useRegulationFlags from '../../../../../hooks/useRegulationFlags';
import { THooks } from '../../../../../types';
import { MarketType, MarketTypeDetails, PlatformDetails } from '../../../constants';
import { JurisdictionModal } from '../../../modals/JurisdictionModal';
import { MT5PasswordModal } from '../../../modals/MT5PasswordModal';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { getUIState } = useUIContext();
    const activeRegulation = getUIState('regulation');
    const { isEU } = useRegulationFlags(activeRegulation);
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const description = marketTypeDetails?.description ?? '';
    const { data: activeAccount } = useAuthorize();
    const { setCfdState } = Provider.useCFDContext();
    const { show } = Provider.useModal();

    const trailingButtonClick = () => {
        setCfdState('marketType', account.market_type);
        setCfdState('platform', PlatformDetails.mt5.platform);
        !activeAccount?.is_virtual && show(<JurisdictionModal />);
        activeAccount?.is_virtual && show(<MT5PasswordModal />);
    };

    const title = marketTypeDetails?.title ?? '';

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />}
        >
            <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
