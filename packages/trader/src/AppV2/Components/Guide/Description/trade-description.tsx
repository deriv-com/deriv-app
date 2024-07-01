import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';
import AccumulatorsTradeDescription from './ContractDescription/accumulators-trade-description';
import MultiplierTradeDescriptions from './ContractDescription/multipliers-trade-description';
import VanillasTradeDescription from './ContractDescription/vanillas-trade-description';
import TurbosTradeDescription from './ContractDescription/turbos-trade-description';

const RiseFallTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "rise-fall-trade-description" */ './ContractDescription/rise-fall-trade-description'
                )
        ),
    () => <Loading />
)();

const HigherLowerTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "higher-lower-trade-description" */ './ContractDescription/higher-lower-trade-description'
                )
        ),
    () => <Loading />
)();

const TouchNoTouchTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "touch-no-touch-trade-description" */ './ContractDescription/touch-no-touch-trade-description'
                )
        ),
    () => <Loading />
)();

const MatchesDiffersTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "matches-differs-trade-description" */ './ContractDescription/matches-differs-trade-description'
                )
        ),
    () => <Loading />
)();

const EvenOddTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "even-odd-trade-description" */ './ContractDescription/even-odd-trade-description'
                )
        ),
    () => <Loading />
)();

const OverUnderTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "over-under-trade-description" */ './ContractDescription/over-under-trade-description'
                )
        ),
    () => <Loading />
)();

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
