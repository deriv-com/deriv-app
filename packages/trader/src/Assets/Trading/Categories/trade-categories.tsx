import React from 'react';
import { Text } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import AccumulatorTradeDescription from './Description/accumulator-trade-description';
import AsianTradeDescription from './Description/asian-trade-description';
import CallPutSpreadTradeDescription from './Description/call-put-spread-trade-description';
import EndTradeDescription from './Description/end-trade-description';
import EvenOddTradeDescription from './Description/even-odd-trade-description';
import HighLowTradeDescription from './Description/high-low-trade-description';
import LbHighLowTradeDescription from './Description/lb-high-low-trade-description';
import LbPutTradeDescription from './Description/lb-put-trade-description';
import LbCallTradeDescription from './Description/lb-call-trade-description';
import MatchDiffTradeDescription from './Description/match-diff-trade-description';
import MultiplierTradeDescription from './Description/multiplier-trade-description';
import OverUnderTradeDescription from './Description/over-under-trade-description';
import RiseFallTradeDescription from './Description/rise-fall-trade-description';
import RunHighLowTradeDescription from './Description/run-high-low-trade-description';
import ResetTradeDescription from './Description/reset-trade-description';
import StayTradeDescription from './Description/stay-trade-description';
import TurbosTradeDescription from './Description/turbos-trade-description';
import TouchTradeDescription from './Description/touch-trade-description';
import TickHighLowTradeDescription from './Description/tick-high-low-trade-description';
import VanillaTradeDescription from './Description/vanilla-trade-description';

const TradeCategories = ({
    category,
    onClick,
    is_vanilla_fx = false,
    is_multiplier_fx = false,
}: {
    category?: string;
    onClick: (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    is_vanilla_fx?: boolean;
    is_multiplier_fx?: boolean;
}) => {
    let TradeTypeTemplate;
    if (category) {
        switch (category) {
            case TRADE_TYPES.ACCUMULATOR:
                TradeTypeTemplate = <AccumulatorTradeDescription onClick={onClick} />;
                break;
            case TRADE_TYPES.RISE_FALL:
            case TRADE_TYPES.RISE_FALL_EQUAL:
                TradeTypeTemplate = <RiseFallTradeDescription />;
                break;
            case TRADE_TYPES.HIGH_LOW:
                TradeTypeTemplate = <HighLowTradeDescription />;
                break;
            case TRADE_TYPES.END:
                TradeTypeTemplate = <EndTradeDescription />;
                break;
            case TRADE_TYPES.STAY:
                TradeTypeTemplate = <StayTradeDescription />;
                break;
            case TRADE_TYPES.MATCH_DIFF:
                TradeTypeTemplate = <MatchDiffTradeDescription />;
                break;
            case TRADE_TYPES.EVEN_ODD:
                TradeTypeTemplate = <EvenOddTradeDescription />;
                break;
            case TRADE_TYPES.OVER_UNDER:
                TradeTypeTemplate = <OverUnderTradeDescription />;
                break;
            case TRADE_TYPES.TOUCH:
                TradeTypeTemplate = <TouchTradeDescription />;
                break;
            case TRADE_TYPES.ASIAN:
                TradeTypeTemplate = <AsianTradeDescription />;
                break;
            case TRADE_TYPES.RUN_HIGH_LOW:
                TradeTypeTemplate = <RunHighLowTradeDescription />;
                break;
            case TRADE_TYPES.RESET:
                TradeTypeTemplate = <ResetTradeDescription />;
                break;
            case TRADE_TYPES.CALL_PUT_SPREAD:
                TradeTypeTemplate = <CallPutSpreadTradeDescription />;
                break;
            case TRADE_TYPES.TICK_HIGH_LOW:
                TradeTypeTemplate = <TickHighLowTradeDescription />;
                break;
            case TRADE_TYPES.LB_HIGH_LOW:
                TradeTypeTemplate = <LbHighLowTradeDescription />;
                break;
            case TRADE_TYPES.LB_PUT:
                TradeTypeTemplate = <LbPutTradeDescription />;
                break;
            case TRADE_TYPES.LB_CALL:
                TradeTypeTemplate = <LbCallTradeDescription />;
                break;
            case TRADE_TYPES.MULTIPLIER:
                TradeTypeTemplate = (
                    <MultiplierTradeDescription is_multiplier_fx={is_multiplier_fx} onClick={onClick} />
                );
                break;
            case TRADE_TYPES.TURBOS.LONG:
            case TRADE_TYPES.TURBOS.SHORT:
                TradeTypeTemplate = <TurbosTradeDescription onClick={onClick} />;
                break;
            case TRADE_TYPES.VANILLA.CALL:
            case TRADE_TYPES.VANILLA.PUT:
                TradeTypeTemplate = <VanillaTradeDescription is_vanilla_fx={is_vanilla_fx} onClick={onClick} />;
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
    return <>{TradeTypeTemplate}</>;
};

export default TradeCategories;
