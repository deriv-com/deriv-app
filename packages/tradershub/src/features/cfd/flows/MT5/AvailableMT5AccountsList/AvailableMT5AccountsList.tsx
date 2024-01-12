import React from 'react';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../components';
import { THooks } from '../../../../../types';
import { MarketTypeDetails } from '../../../constants';
import { MT5AccountIcon } from '../MT5AccountIcon';

const AvailableMT5AccountsList = ({ account }: { account: THooks.MT5AccountsList }) => {
    const { description, title } = MarketTypeDetails[account.market_type || 'all'];

    const LeadingIcon = () => <MT5AccountIcon account={account} />;

    const TrailingButton = () => <TradingAccountCardLightButton />;

    return (
        <TradingAccountCard leading={LeadingIcon} trailing={TrailingButton}>
            <TradingAccountCardContent title={title}>{description}</TradingAccountCardContent>
        </TradingAccountCard>
    );
};

export default AvailableMT5AccountsList;
