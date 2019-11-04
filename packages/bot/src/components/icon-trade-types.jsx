import PropTypes  from 'prop-types';
import React      from 'react';
import {
    TradeTypeAsianDown,
    TradeTypeAsianUp,
    TradeTypeCallBarrier,
    TradeTypeCall,
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
    TradeTypeUnknown } from './Icons.jsx';

const IconTradeType = ({ trade_type, className }) => {
    switch (trade_type.toLowerCase()) {
        case 'asiand'      : return <TradeTypeAsianDown className={className} />;
        case 'asianu'      : return <TradeTypeAsianUp className={className} />;
        case 'call_barrier': return <TradeTypeCallBarrier className={className} />;
        case 'calle'       :
        case 'call'        : return <TradeTypeCall className={className} />;
        case 'callspread'  : return <TradeTypeCallSpread className={className} />;
        case 'putspread'   : return <TradeTypePutSpread className={className} />;
        case 'digitdiff'   : return <TradeTypeDigitDiff className={className} />;
        case 'digiteven'   : return <TradeTypeDigitEven className={className} />;
        case 'digitmatch'  : return <TradeTypeDigitMatch className={className} />;
        case 'digitodd'    : return <TradeTypeDigitOdd className={className} />;
        case 'digitover'   : return <TradeTypeDigitOver className={className} />;
        case 'digitunder'  : return <TradeTypeDigitUnder className={className} />;
        case 'expirymiss'  : return <TradeTypeExpiryMiss className={className} />;
        case 'expiryrangee':
        case 'expiryrange' : return <TradeTypeExpiryRange className={className} />;
        case 'notouch'     : return <TradeTypeNoTouch className={className} />;
        case 'onetouch'    : return <TradeTypeOneTouch className={className} />;
        case 'put_barrier' : return <TradeTypePutBarrier className={className} />;
        case 'pute'        :
        case 'put'         : return <TradeTypePut className={className} />;
        case 'range'       : return <TradeTypeRange className={className} />;
        case 'resetcall'   : return <TradeTypeResetCall className={className} />;
        case 'resetput'    : return <TradeTypeResetPut className={className} />;
        case 'runhigh'     : return <TradeTypeRunHigh className={className} />;
        case 'runlow'      : return <TradeTypeRunLow className={className} />;
        case 'tickhigh'    : return <TradeTypeTickHigh className={className} />;
        case 'ticklow'     : return <TradeTypeTickLow className={className} />;
        case 'upordown'    : return <TradeTypeUpOrDown className={className} />;
        default            : return <TradeTypeUnknown className={className} />;
    }
};

IconTradeType.propTypes = {
    trade_type: PropTypes.string,
};

export default IconTradeType;
