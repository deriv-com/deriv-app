import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import AccumulatorTradeDescription from './Description/accumulator-trade-description';
import AsianTradeDescription from './Description/asian-trade-description';
import CallPutSpreadTradeDescription from './Description/call-put-spread-trade-description';
import EndTradeDescription from './Description/end-trade-description';
import EvenOddTradeDescription from './Description/even-odd-trade-description';
import HighLowTradeDescription from './Description/high-low-trade-description';
import LbHighLowTradeDescription from './Description/lb-high-low-trade-description';
import LbPutTradeDescription from './Description/lb-put-trade-desciption';
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
}: {
    category?: string;
    onClick: React.MouseEventHandler<HTMLSpanElement>;
}) => {
    let TradeTypeTemplate;
    if (category) {
        switch (category) {
            case 'accumulator':
                TradeTypeTemplate = <AccumulatorTradeDescription onClick={onClick} />;
                break;
            case 'rise_fall':
            case 'rise_fall_equal':
                TradeTypeTemplate = <RiseFallTradeDescription />;
                break;
            case 'high_low':
                TradeTypeTemplate = <HighLowTradeDescription />;
                break;
            case 'end':
                TradeTypeTemplate = <EndTradeDescription />;
                break;
            case 'stay':
                TradeTypeTemplate = <StayTradeDescription />;
                break;
            case 'match_diff':
                TradeTypeTemplate = <MatchDiffTradeDescription />;
                break;
            case 'even_odd':
                TradeTypeTemplate = <EvenOddTradeDescription />;
                break;
            case 'over_under':
                TradeTypeTemplate = <OverUnderTradeDescription />;
                break;
            case 'touch':
                TradeTypeTemplate = <TouchTradeDescription />;
                break;
            case 'asian':
                TradeTypeTemplate = <AsianTradeDescription />;
                break;
            case 'run_high_low':
                TradeTypeTemplate = <RunHighLowTradeDescription />;
                break;
            case 'reset':
                TradeTypeTemplate = <ResetTradeDescription />;
                break;
            case 'callputspread':
                TradeTypeTemplate = <CallPutSpreadTradeDescription />;
                break;
            case 'tick_high_low':
                TradeTypeTemplate = <TickHighLowTradeDescription />;
                break;
            case 'lb_high_low':
                TradeTypeTemplate = <LbHighLowTradeDescription />;
                break;
            case 'lb_put':
                TradeTypeTemplate = <LbPutTradeDescription />;
                break;
            case 'lb_call':
                TradeTypeTemplate = <LbCallTradeDescription />;
                break;
            case 'multiplier':
                TradeTypeTemplate = <MultiplierTradeDescription />;
                break;
            case 'turbosshort':
            case 'turboslong':
                TradeTypeTemplate = <TurbosTradeDescription />;
                break;
            case 'vanilla':
                TradeTypeTemplate = <VanillaTradeDescription onClick={onClick} />;
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
