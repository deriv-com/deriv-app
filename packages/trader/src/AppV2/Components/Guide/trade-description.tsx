import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import AccumulatorsTradeDescription from './Description/accumulators-trade-description';

const TradeDescription = ({ contract_type }: { contract_type: string }) => {
    let TradeTypeTemplate;
    if (contract_type) {
        switch (contract_type) {
            case CONTRACT_LIST.ACCUMULATORS:
                TradeTypeTemplate = <AccumulatorsTradeDescription />;
                break;
            default:
                TradeTypeTemplate = (
                    <Text as='p'>
                        <Localize i18n_default_text='Description not found.' />
                    </Text>
                );
                break;
        }
    }
    return <React.Fragment>{TradeTypeTemplate}</React.Fragment>;
};

export default TradeDescription;
