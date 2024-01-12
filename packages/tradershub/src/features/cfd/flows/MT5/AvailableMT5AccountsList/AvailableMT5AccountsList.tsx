import React from 'react';
import { useAuthorize } from '@deriv/api';
import { Provider } from '@deriv/library';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../components';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { JurisdictionModal } from '../../../modals/JurisdictionModal';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];
    const { data: activeAccount } = useAuthorize();
    const { setCfdState } = Provider.useCFDContext();
    const { show } = Provider.useModal();

    const trailingButtonClick = () => {
        setCfdState('marketType', account.market_type);
        !activeAccount?.is_virtual && show(<JurisdictionModal />); /* show MT5PasswordModal for demo */
    };

    const LeadingIcon = () => <MT5AccountIcon account={account} />;

    const TrailingButton = () => <TradingAccountCardLightButton onSubmit={trailingButtonClick} />;

    return (
        <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
            <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
