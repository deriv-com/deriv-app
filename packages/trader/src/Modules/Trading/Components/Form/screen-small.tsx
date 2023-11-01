import React from 'react';
import { Collapsible, Text } from '@deriv/components';
import { TradeParamsLoader } from 'App/Components/Elements/ContentLoader';
import AllowEqualsMobile from 'Modules/Trading/Containers/allow-equals';
import {
    hasCallPutEqual,
    hasDurationForCallPutEqual,
    isRiseFallEqual,
} from 'Stores/Modules/Trading/Helpers/allow-equals';
import {
    AccumulatorOptionsWidget,
    MultiplierOptionsWidget,
} from 'Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx';
import AccumulatorsAmountMobile from 'Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-amount-mobile';
import AccumulatorsInfoDisplay from 'Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-info-display';
import { BarrierMobile, LastDigitMobile } from 'Modules/Trading/Containers/trade-params-mobile';
import ContractType from 'Modules/Trading/Containers/contract-type';
import MobileWidget from 'Modules/Trading/Components/Elements/mobile-widget.jsx';
import Purchase from 'Modules/Trading/Containers/purchase';
import RiskManagementInfo from 'Modules/Trading/Components/Elements/Multiplier/risk-management-info';
import TakeProfit from 'Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit.jsx';
import 'Sass/app/_common/mobile-widget.scss';
import classNames from 'classnames';
import AccumulatorsStats from 'Modules/Contract/Components/AccumulatorsStats';
import Strike from 'Modules/Trading/Components/Form/TradeParams/strike.jsx';
import BarrierSelector from 'Modules/Trading/Components/Form/TradeParams/Turbos/barrier-selector';
import PayoutPerPointMobile from 'Modules/Trading/Components/Elements/payout-per-point-mobile';
import TradeTypeTabs from 'Modules/Trading/Components/Form/TradeParams/trade-type-tabs';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { Localize } from '@deriv/translations';

type TCollapsibleTradeParams = Pick<
    ReturnType<typeof useTraderStore>,
    | 'form_components'
    | 'has_take_profit'
    | 'previous_symbol'
    | 'is_accumulator'
    | 'is_trade_params_expanded'
    | 'is_multiplier'
    | 'is_vanilla'
    | 'is_turbos'
    | 'onChange'
    | 'take_profit'
    | 'setIsTradeParamsExpanded'
    | 'last_digit'
> & {
    has_allow_equals: boolean;
    is_allow_equal: boolean;
};

const CollapsibleTradeParams = ({
    form_components,
    has_allow_equals,
    has_take_profit,
    previous_symbol,
    is_allow_equal,
    is_accumulator,
    is_multiplier,
    is_trade_params_expanded,
    is_turbos,
    is_vanilla,
    onChange,
    take_profit,
    setIsTradeParamsExpanded,
    last_digit,
}: TCollapsibleTradeParams) => {
    React.useEffect(() => {
        if (previous_symbol && is_allow_equal && has_allow_equals) setIsTradeParamsExpanded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previous_symbol]);

    const is_collapsed = !is_trade_params_expanded;

    const onClick = (e: boolean) => {
        setIsTradeParamsExpanded(e);
    };

    const toggleDigitsWidget = () => {
        setIsTradeParamsExpanded(true);
    };

    const isVisible = (component: string) => form_components.includes(component);

    return (
        <Collapsible position='top' is_collapsed={is_collapsed} onClick={onClick}>
            {is_accumulator && is_collapsed && <AccumulatorsStats />}
            <div className='trade-params__contract-type-container'>
                <ContractType />
                {is_multiplier && <MultiplierOptionsWidget />}
                {isVisible('trade_type_tabs') && <TradeTypeTabs />}
                {is_accumulator && <AccumulatorOptionsWidget />}
                {isVisible('last_digit') && is_collapsed && (
                    <Text
                        as='p'
                        size='xxs'
                        color='prominent'
                        line_height='s'
                        weight='bold'
                        className='mobile-widget__digit'
                        onClick={toggleDigitsWidget}
                    >
                        <Localize i18n_default_text='Digit: {{last_digit}} ' values={{ last_digit }} />
                    </Text>
                )}
            </div>
            {isVisible('last_digit') && (
                <div data-collapsible='true'>
                    <LastDigitMobile />
                </div>
            )}
            {isVisible('barrier') && (
                <div data-collapsible='true'>
                    <BarrierMobile />
                </div>
            )}
            {isVisible('barrier_selector') && (
                <div data-collapsible='true'>
                    <BarrierSelector />
                </div>
            )}
            {isVisible('strike') && (
                <div data-collapsible='true'>
                    <Strike />
                </div>
            )}
            {!is_accumulator && <MobileWidget />}
            {has_allow_equals && (
                <div data-collapsible='true'>
                    <AllowEqualsMobile />
                </div>
            )}
            {is_multiplier && (
                <div data-collapsible='true'>
                    <RiskManagementInfo />
                </div>
            )}
            {is_accumulator && [
                <AccumulatorsAmountMobile key='accu_amount' />,
                <div
                    data-collapsible='true'
                    key='accu_take_profit'
                    className={classNames('take-profit', 'mobile-widget')}
                >
                    <TakeProfit
                        //@ts-expect-error Observer wrapped component needs to be ts migrated before props can be detected
                        take_profit={take_profit}
                        has_take_profit={has_take_profit}
                        onChange={onChange}
                        has_info={false}
                    />
                </div>,
                <div data-collapsible='true' key='accu_info'>
                    <AccumulatorsInfoDisplay />
                </div>,
            ]}
            {is_turbos && (
                <div data-collapsible='true' className={classNames('take-profit', 'mobile-widget')}>
                    <TakeProfit
                        //@ts-expect-error Observer wrapped component needs to be ts migrated before props can be detected
                        take_profit={take_profit}
                        has_take_profit={has_take_profit}
                        onChange={onChange}
                        has_info={false}
                    />
                </div>
            )}
            {(is_turbos || is_vanilla) && <PayoutPerPointMobile />}
            <div
                className={classNames({
                    'purchase-container': !is_vanilla,
                    [`purchase-container__${is_accumulator ? 'accumulator' : 'turbos'}`]: is_accumulator || is_turbos,
                })}
            >
                <Purchase />
            </div>
        </Collapsible>
    );
};

const ScreenSmall = observer(({ is_trade_enabled }: { is_trade_enabled: boolean }) => {
    const trade_store = useTraderStore();
    const {
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        duration_unit,
        contract_types_list,
        contract_type,
        expiry_type,
        contract_start_type,
        form_components,
        has_take_profit,
        onChange,
        previous_symbol,
        is_trade_params_expanded,
        setIsTradeParamsExpanded,
        take_profit,
        last_digit,
    } = trade_store;
    const is_allow_equal = !!trade_store.is_equal;

    const collapsible_trade_params_props = {
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        form_components,
        has_take_profit,
        onChange,
        previous_symbol,
        is_trade_params_expanded,
        setIsTradeParamsExpanded,
        take_profit,
        is_allow_equal,
        last_digit,
    };

    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );

    const has_callputequal = hasCallPutEqual(contract_types_list);
    const has_allow_equals =
        isRiseFallEqual(contract_type) && (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    return !is_trade_enabled ? (
        <div className='mobile-wrapper__content-loader'>
            <TradeParamsLoader speed={2} />
        </div>
    ) : (
        <CollapsibleTradeParams has_allow_equals={has_allow_equals} {...collapsible_trade_params_props} />
    );
});

export default ScreenSmall;
