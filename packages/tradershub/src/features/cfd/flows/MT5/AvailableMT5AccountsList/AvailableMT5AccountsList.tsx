import React from 'react';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
    useUIContext,
} from '../../../../../components';
import useRegionFlags from '../../../../../hooks/useRegionFlags';
import { THooks } from '../../../../../types';
import { MarketType, MarketTypeDetails } from '../../../constants';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { getUIState } = useUIContext();
    const activeRegion = getUIState('region');
    const { isEU } = useRegionFlags(activeRegion);
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const description = marketTypeDetails?.description ?? '';

    const title = marketTypeDetails?.title ?? '';

    return (
        <TradingAccountCard
            leading={() => <MT5AccountIcon account={account} />}
            trailing={() => <TradingAccountCardLightButton />}
        >
            <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
