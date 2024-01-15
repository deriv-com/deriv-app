import React from 'react';
import { useAuthorize, useIsEuRegion } from '@deriv/api';
import { Provider } from '@deriv/library';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../components';
import { THooks } from '../../../../../types';
import { MarketType, MarketTypeDetails } from '../../../constants';
import { JurisdictionModal } from '../../../modals/JurisdictionModal';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { isEU } = useIsEuRegion();
    const marketTypeDetails = MarketTypeDetails(isEU)[account.market_type ?? MarketType.ALL];
    const description = marketTypeDetails?.description ?? '';
    const { data: activeAccount } = useAuthorize();
    const { setCfdState } = Provider.useCFDContext();
    const { show } = Provider.useModal();

    const trailingButtonClick = () => {
        setCfdState('marketType', account.market_type);
        !activeAccount?.is_virtual && show(<JurisdictionModal />); /* show MT5PasswordModal for demo */
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
