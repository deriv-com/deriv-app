import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import AccumulatorsTradeDescription from './Contract description/accumulators-trade-description';
import RiseFallTradeDescription from './Contract description/rise-fall-trade-description';
import MultiplierTradeDescriptions from './Contract description/multipliers-trade-description';
import VanillasTradeDescription from './Contract description/vanillas-trade-description';
import TurbosTradeDescription from './Contract description/turbos-trade-description';
import HigherLowerTradeDescription from './Contract description/higher-lower-trade-description';
import TouchNoTouchTradeDescription from './Contract description/touch-no-touch-trade-description';
import MatchesDiffersTradeDescription from './Contract description/matches-differs-trade-description';
import EvenOddTradeDescription from './Contract description/even-odd-trade-description';
import OverUnderTradeDescription from './Contract description/over-under-trade-description';

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
        case CONTRACT_LIST['TOUCH/NO TOUCH']:
            TradeTypeTemplate = <TouchNoTouchTradeDescription />;
            break;
        case CONTRACT_LIST['MATCHES/DIFFERS']:
            TradeTypeTemplate = <MatchesDiffersTradeDescription />;
            break;
        case CONTRACT_LIST['EVEN/ODD']:
            TradeTypeTemplate = <EvenOddTradeDescription />;
            break;
        case CONTRACT_LIST['OVER/UNDER']:
            TradeTypeTemplate = <OverUnderTradeDescription />;
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
