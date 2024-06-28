import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import AccumulatorsTradeDescription from './Description/accumulators-trade-description';
import RiseFallTradeDescription from './Description/rise-fall-trade-description';
import MultiplierTradeDescriptions from './Description/multipliers-trade-description';
import VanillasTradeDescription from './Description/vanillas-trade-description';
import TurbosTradeDescription from './Description/turbos-trade-description';
import HigherLowerTradeDescription from './Description/higher-lower-trade-description';

const TradeDescription = ({
    contract_type,
    onTermClick,
}: {
    contract_type: string;
    onTermClick: (term: string) => void;
}) => {
    let TradeTypeTemplate;
    switch (contract_type) {
        case CONTRACT_LIST.ACCUMULATORS:
            TradeTypeTemplate = <AccumulatorsTradeDescription onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST['RISE/FALL']:
            TradeTypeTemplate = <RiseFallTradeDescription />;
            break;
        case CONTRACT_LIST.MULTIPLIERS:
            TradeTypeTemplate = <MultiplierTradeDescriptions onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST.VANILLAS:
            TradeTypeTemplate = <VanillasTradeDescription onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST.TURBOS:
            TradeTypeTemplate = <TurbosTradeDescription onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST['HIGHER/LOWER']:
            TradeTypeTemplate = <HigherLowerTradeDescription />;
            break;
        default:
            TradeTypeTemplate = (
                <Text as='p'>
                    <Localize i18n_default_text='Description not found.' />
                </Text>
            );
            break;
    }
    return <React.Fragment>{TradeTypeTemplate}</React.Fragment>;
};

export default TradeDescription;
