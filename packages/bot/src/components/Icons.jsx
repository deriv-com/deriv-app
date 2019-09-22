import React                   from 'react';
import classNames              from 'classnames';
// General
import logo                    from '../assets/icons/ic-logo.svg';
import blueInfo                from '../assets/icons/icon-info-blue.svg';
import check                   from '../assets/icons/ic-check.svg';
import cross                   from '../assets/icons/ic-cross.svg';
import tradeActive             from '../assets/icons/ic-trade-active.svg';
import iconInfoOutline         from '../assets/icons/icon-info-outline.svg';
// Toolbox
import toolbox_stage1          from '../assets/icons/ic-stage-1.svg';
import toolbox_stage2          from '../assets/icons/ic-stage-2.svg';
import toolbox_stage3          from '../assets/icons/ic-stage-3.svg';
import toolbox_stage4          from '../assets/icons/ic-stage-4.svg';
import toolbox_arrow1          from '../assets/icons/ic-arrow-1.svg';
import toolbox_arrow2          from '../assets/icons/ic-arrow-2.svg';
// Contract
import contract_plunkown       from '../assets/icons/ic-unknown.svg';
import contract_profit         from '../assets/icons/ic-profit.svg';
import contract_loss           from '../assets/icons/ic-loss.svg';
// Trade Types
import trade_type_asiand       from '../assets/icons/trade-types/asiand.svg';
import trade_type_asianu       from '../assets/icons/trade-types/asianu.svg';
import trade_type_call         from '../assets/icons/trade-types/call.svg';
import trade_type_call_barrier from '../assets/icons/trade-types/call_barrier.svg';
import trade_type_calle_light  from '../assets/icons/trade-types/calle_light.svg';
import trade_type_callspread   from '../assets/icons/trade-types/callspread.svg';
import trade_type_digitdiff    from '../assets/icons/trade-types/digitdiff.svg';
import trade_type_digiteven    from '../assets/icons/trade-types/digiteven.svg';
import trade_type_digitmatch   from '../assets/icons/trade-types/digitmatch.svg';
import trade_type_digitodd     from '../assets/icons/trade-types/digitodd.svg';
import trade_type_digitover    from '../assets/icons/trade-types/digitover.svg';
import trade_type_digitunder   from '../assets/icons/trade-types/digitunder.svg';
import trade_type_expirymiss   from '../assets/icons/trade-types/expirymiss.svg';
import trade_type_expiryrange  from '../assets/icons/trade-types/expiryrange.svg';
import trade_type_expiryrangee from '../assets/icons/trade-types/expiryrangee.svg';
import trade_type_notouch      from '../assets/icons/trade-types/notouch.svg';
import trade_type_onetouch     from '../assets/icons/trade-types/onetouch.svg';
import trade_type_put          from '../assets/icons/trade-types/put.svg';
import trade_type_put_barrier  from '../assets/icons/trade-types/put_barrier.svg';
import trade_type_putspread    from '../assets/icons/trade-types/putspread.svg';
import trade_type_range        from '../assets/icons/trade-types/range.svg';
import trade_type_resetcall    from '../assets/icons/trade-types/resetcall.svg';
import trade_type_resetput     from '../assets/icons/trade-types/resetput.svg';
import trade_type_runhigh      from '../assets/icons/trade-types/runhigh.svg';
import trade_type_runlow       from '../assets/icons/trade-types/runlow.svg';
import trade_type_tickhigh     from '../assets/icons/trade-types/tickhigh.svg';
import trade_type_ticklow      from '../assets/icons/trade-types/ticklow.svg';
import trade_type_unknown      from '../assets/icons/trade-types/unknown.svg';
import trade_type_upordown     from '../assets/icons/trade-types/upordown.svg';

/* eslint-disable react/display-name */
export const Icon = svgItem => (props) => {
    const { className } = props;
    const [width, height] = svgItem.viewBox.split(' ').slice(2);

    return (
        <svg width={width} height={height} className={classNames('icon', { [className]: !!className }) }>
            { /* eslint-disable-next-line */ }
            <use xlinkHref={`${__webpack_public_path__}bot-sprite.svg#${svgItem.id}`} />
        </svg>
    );
};

export const preloadSprite = () => {
    const sprite = new Image();
    sprite.src = `${__webpack_public_path__}bot-sprite.svg`; // eslint-disable-line
};

// General
export const LogoIcon              = Icon(logo);
export const TradeActive           = Icon(tradeActive);
export const BlueInfoIcon          = Icon(blueInfo);
export const IconInfoOutline       = Icon(iconInfoOutline);
export const CheckIcon             = Icon(check);
export const CrossIcon             = Icon(cross);
// Toolbox
export const Stage1Icon            = Icon(toolbox_stage1);
export const Stage2Icon            = Icon(toolbox_stage2);
export const Stage3Icon            = Icon(toolbox_stage3);
export const Stage4Icon            = Icon(toolbox_stage4);
export const Arrow1Icon            = Icon(toolbox_arrow1);
export const Arrow2Icon            = Icon(toolbox_arrow2);
// Contract
export const ProfitMovementIcon    = Icon(contract_profit);
export const LossMovementIcon      = Icon(contract_loss);
export const UnknownMovementIcon   = Icon(contract_plunkown);
// Trade Type
export const TradeTypeAsianDown    = Icon(trade_type_asiand);
export const TradeTypeAsianUp      = Icon(trade_type_asianu);
export const TradeTypeCall         = Icon(trade_type_call);
export const TradeTypeCallBarrier  = Icon(trade_type_call_barrier);
export const TradeTypeCalleLight   = Icon(trade_type_calle_light);
export const TradeTypeCallSpread   = Icon(trade_type_callspread);
export const TradeTypeDigitDiff    = Icon(trade_type_digitdiff);
export const TradeTypeDigitEven    = Icon(trade_type_digiteven);
export const TradeTypeDigitMatch   = Icon(trade_type_digitmatch);
export const TradeTypeDigitOdd     = Icon(trade_type_digitodd);
export const TradeTypeDigitOver    = Icon(trade_type_digitover);
export const TradeTypeDigitUnder   = Icon(trade_type_digitunder);
export const TradeTypeEpiryMiss    = Icon(trade_type_expirymiss);
export const TradeTypeExpiryRange  = Icon(trade_type_expiryrange);
export const TradeTypeExpiryRangee = Icon(trade_type_expiryrangee);
export const TradeTypeNoTouch      = Icon(trade_type_notouch);
export const TradeTypeOneTouch     = Icon(trade_type_onetouch);
export const TradeTypePut          = Icon(trade_type_put);
export const TradeTypePutBarrier   = Icon(trade_type_put_barrier);
export const TradeTypePutSpread    = Icon(trade_type_putspread);
export const TradeTypeRange        = Icon(trade_type_range);
export const TradeTypeResetCall    = Icon(trade_type_resetcall);
export const TradeTypeResetPut     = Icon(trade_type_resetput);
export const TradeTypeRunHigh      = Icon(trade_type_runhigh);
export const TradeTypeRunLow       = Icon(trade_type_runlow);
export const TradeTypeTickHigh     = Icon(trade_type_tickhigh);
export const TradeTypeTickLow      = Icon(trade_type_ticklow);
export const TradeTypeUnknown      = Icon(trade_type_unknown);
export const TradeTypeUpOrDown     = Icon(trade_type_upordown);
