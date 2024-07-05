import React from 'react';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { CONTRACT_LIST } from 'AppV2/Utils/trade-types-utils';

type TContractDescription = {
    onTermClick: (term: string) => void;
};

const AccumulatorsTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "accumulators-trade-description" */ './ContractDescription/accumulators-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)() as React.ComponentType<TContractDescription>;

const MultiplierTradeDescriptions = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "multipliers-trade-description" */ './ContractDescription/multipliers-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)() as React.ComponentType<TContractDescription>;

const VanillasTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "vanillas-trade-description" */ './ContractDescription/vanillas-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)() as React.ComponentType<TContractDescription>;

const TurbosTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "turbos-trade-description" */ './ContractDescription/turbos-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)() as React.ComponentType<TContractDescription>;

const RiseFallTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "rise-fall-trade-description" */ './ContractDescription/rise-fall-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)();

const HigherLowerTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "higher-lower-trade-description" */ './ContractDescription/higher-lower-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)();

const TouchNoTouchTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "touch-no-touch-trade-description" */ './ContractDescription/touch-no-touch-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)();

const MatchesDiffersTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "matches-differs-trade-description" */ './ContractDescription/matches-differs-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)();

const EvenOddTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "even-odd-trade-description" */ './ContractDescription/even-odd-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)();

const OverUnderTradeDescription = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "over-under-trade-description" */ './ContractDescription/over-under-trade-description'
                )
        ),
    () => <Loading is_fullscreen={false} />
)();

const TradeDescription = ({
    contract_type,
    onTermClick,
}: {
    contract_type: string;
    onTermClick: (term: string) => void;
}) => {
    let trade_type_template;
    switch (contract_type) {
        case CONTRACT_LIST.ACCUMULATORS:
            trade_type_template = <AccumulatorsTradeDescription onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST.RISE_FALL:
            trade_type_template = <RiseFallTradeDescription />;
            break;
        case CONTRACT_LIST.MULTIPLIERS:
            trade_type_template = <MultiplierTradeDescriptions onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST.VANILLAS:
            trade_type_template = <VanillasTradeDescription onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST.TURBOS:
            trade_type_template = <TurbosTradeDescription onTermClick={onTermClick} />;
            break;
        case CONTRACT_LIST.HIGHER_LOWER:
            trade_type_template = <HigherLowerTradeDescription />;
            break;
        case CONTRACT_LIST.TOUCH_NO_TOUCH:
            trade_type_template = <TouchNoTouchTradeDescription />;
            break;
        case CONTRACT_LIST.MATCHES_DIFFERS:
            trade_type_template = <MatchesDiffersTradeDescription />;
            break;
        case CONTRACT_LIST.EVEN_ODD:
            trade_type_template = <EvenOddTradeDescription />;
            break;
        case CONTRACT_LIST.OVER_UNDER:
            trade_type_template = <OverUnderTradeDescription />;
            break;
        default:
            trade_type_template = (
                <Text as='p'>
                    <Localize i18n_default_text='Description not found.' />
                </Text>
            );
            break;
    }
    return <React.Fragment>{trade_type_template}</React.Fragment>;
};

export default TradeDescription;
