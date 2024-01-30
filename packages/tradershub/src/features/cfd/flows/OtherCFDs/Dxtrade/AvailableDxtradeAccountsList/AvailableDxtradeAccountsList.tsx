import React from 'react';
import { PlatformIcon } from '../../../../../../components';
import {
    TradingAccountCard,
    TradingAccountCardContent,
    TradingAccountCardLightButton,
} from '../../../../../../components/TradingAccountCard';
import { getStaticUrl } from '../../../../../../helpers/urls';
import { PlatformDetails } from '../../../../constants';

const leadingIcon = () => (
    <PlatformIcon
        height='70px'
        icon='DerivX'
        onClick={() => {
            window.open(getStaticUrl('/derivx'));
        }}
        width='70px'
    />
);

const TrailingButton = () => <TradingAccountCardLightButton />;

const AvailableDxtradeAccountsList = () => (
    <TradingAccountCard leading={leadingIcon} trailing={TrailingButton}>
        <TradingAccountCardContent title={PlatformDetails.dxtrade.title}>
            This account offers CFDs on a highly customisable CFD trading platform.
        </TradingAccountCardContent>
    </TradingAccountCard>
);

export default AvailableDxtradeAccountsList;
