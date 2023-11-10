import React from 'react';
import ImageAsianUpDown from 'Assets/SvgComponents/trade_explanations/img-asian.svg';
import ImageCloseToLow from 'Assets/SvgComponents/trade_explanations/img-close-to-low.svg';
import ImageEndsInOut from 'Assets/SvgComponents/trade_explanations/img-ends-in-out.svg';
import ImageEvenOdd from 'Assets/SvgComponents/trade_explanations/img-even-odd.svg';
import ImageHighLow from 'Assets/SvgComponents/trade_explanations/img-high-low.svg';
import ImageHighToClose from 'Assets/SvgComponents/trade_explanations/img-high-to-close.svg';
import ImageHighToLow from 'Assets/SvgComponents/trade_explanations/img-high-to-low.svg';
import ImageMatchDiff from 'Assets/SvgComponents/trade_explanations/img-match-diff.svg';
import ImageMultiplier from 'Assets/SvgComponents/trade_explanations/img-multiplier.svg';
import ImageOverUnder from 'Assets/SvgComponents/trade_explanations/img-over-under.svg';
import ImageReset from 'Assets/SvgComponents/trade_explanations/img-reset.svg';
import ImageRiseFall from 'Assets/SvgComponents/trade_explanations/img-rise-fall.svg';
import ImageRunHighLow from 'Assets/SvgComponents/trade_explanations/img-run-high-low.svg';
import ImageSpread from 'Assets/SvgComponents/trade_explanations/img-spread.svg';
import ImageTickHighLow from 'Assets/SvgComponents/trade_explanations/img-tick-high-low.svg';
import ImageTouch from 'Assets/SvgComponents/trade_explanations/img-touch.svg';
import ImageTurbos from 'Assets/SvgComponents/trade_explanations/img-turbos.svg';
import ContractTypeDescriptionVideo from './contract-type-description-video';
import { TRADE_TYPES } from '@deriv/shared';

// TODO: Replace static image svgs with themed GIFs or animated SVGs
const TradeCategoriesGIF = ({
    category,
    selected_contract_type,
}: {
    category?: string;
    selected_contract_type?: string;
}) => {
    if (category !== selected_contract_type) return null;
    switch (category) {
        case 'asian':
            return <ImageAsianUpDown />;
        case TRADE_TYPES.CALLPUTSPREAD:
            return <ImageSpread />;
        case 'end':
            return <ImageEndsInOut />;
        case 'even_odd':
            return <ImageEvenOdd />;
        case 'high_low':
            return <ImageHighLow />;
        case 'lb_call':
            return <ImageCloseToLow />;
        case 'lb_put':
            return <ImageHighToClose />;
        case TRADE_TYPES.LBHIGHLOW:
            return <ImageHighToLow />;
        case 'rise_fall':
            return <ImageRiseFall />;
        case 'rise_fall_equal':
            return <ImageRiseFall />;
        case 'match_diff':
            return <ImageMatchDiff />;
        case TRADE_TYPES.MULTIPLIER:
            return <ImageMultiplier />;
        case 'over_under':
            return <ImageOverUnder />;
        case TRADE_TYPES.RESET:
            return <ImageReset />;
        case TRADE_TYPES.RUNHIGHLOW:
            return <ImageRunHighLow />;
        case TRADE_TYPES.ACCUMULATOR:
            return <ContractTypeDescriptionVideo selected_contract_type={selected_contract_type} />;
        case TRADE_TYPES.TICKHIGHLOW:
            return <ImageTickHighLow />;
        case 'touch':
            return <ImageTouch />;
        case TRADE_TYPES.TURBOS.LONG:
        case TRADE_TYPES.TURBOS.SHORT:
            return <ImageTurbos />;
        case TRADE_TYPES.VANILLA.CALL:
        case TRADE_TYPES.VANILLA.PUT:
            return <ContractTypeDescriptionVideo selected_contract_type='vanilla' />;
        default:
            return null;
    }
};

export default TradeCategoriesGIF;
