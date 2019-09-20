import PropTypes  from 'prop-types';
import React      from 'react';
import {
    TradeTypeAsianDown,
    TradeTypeAsianUp,
    TradeTypeCallBarrier,
    TradeTypeCall,
    TradeTypeCalleLight,
    TradeTypeCallSpread,
    TradeTypePutSpread,
    TradeTypeDigitDiff,
    TradeTypeDigitEven,
    TradeTypeDigitMatch,
    TradeTypeDigitOdd,
    TradeTypeDigitOver,
    TradeTypeDigitUnder,
    TradeTypeExpiryMiss,
    TradeTypeExpiryRange,
    TradeTypeExpiryRangee,
    TradeTypeNoTouch,
    TradeTypeOneTouch,
    TradeTypePutBarrier,
    TradeTypePut,
    TradeTypeRange,
    TradeTypeResetCall,
    TradeTypeResetPut,
    TradeTypeRunHigh,
    TradeTypeRunLow,
    TradeTypeTickHigh,
    TradeTypeTickLow,
    TradeTypeUpOrDown,
    TradeTypeUnknown } from './icons.jsx';

const IconTradeType = ({ trade_type }) => {
    switch (trade_type.toLowerCase()) {
        case 'asiand'      : return <TradeTypeAsianDown />;
        case 'asianu'      : return <TradeTypeAsianUp />;
        case 'call_barrier': return <TradeTypeCallBarrier />;
        case 'calle'       :
        case 'call'        : return <TradeTypeCall />;
        case 'calle_light' : return <TradeTypeCalleLight />;
        case 'callspread'  : return <TradeTypeCallSpread />;
        case 'putspread'   : return <TradeTypePutSpread />;
        case 'digitdiff'   : return <TradeTypeDigitDiff />;
        case 'digiteven'   : return <TradeTypeDigitEven />;
        case 'digitmatch'  : return <TradeTypeDigitMatch />;
        case 'digitodd'    : return <TradeTypeDigitOdd />;
        case 'digitover'   : return <TradeTypeDigitOver />;
        case 'digitunder'  : return <TradeTypeDigitUnder />;
        case 'expirymiss'  : return <TradeTypeExpiryMiss />;
        case 'expiryrange' : return <TradeTypeExpiryRange />;
        case 'expiryrangee': return <TradeTypeExpiryRangee />;
        case 'notouch'     : return <TradeTypeNoTouch />;
        case 'onetouch'    : return <TradeTypeOneTouch />;
        case 'put_barrier' : return <TradeTypePutBarrier />;
        case 'pute'        :
        case 'put'         : return <TradeTypePut />;
        case 'range'       : return <TradeTypeRange />;
        case 'resetcall'   : return <TradeTypeResetCall />;
        case 'resetput'    : return <TradeTypeResetPut />;
        case 'runhigh'     : return <TradeTypeRunHigh />;
        case 'runlow'      : return <TradeTypeRunLow />;
        case 'tickhigh'    : return <TradeTypeTickHigh />;
        case 'ticklow'     : return <TradeTypeTickLow />;
        case 'upordown'    : return <TradeTypeUpOrDown />;
        default            : return <TradeTypeUnknown />;
    }
};

IconTradeType.propTypes = {
    trade_type: PropTypes.string,
};

export default IconTradeType;
