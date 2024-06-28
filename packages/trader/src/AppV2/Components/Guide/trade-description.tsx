import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import AccumulatorsTradeDescription from './Description/accumulators-trade-description';
import RiseFallTradeDescription from './Description/rise-fall-trade-description';
import MultiplierTradeDescription from './Description/multipliers-trade-description';

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
            TradeTypeTemplate = <MultiplierTradeDescription onTermClick={onTermClick} />;
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
