import PropTypes  from 'prop-types';
import React      from 'react';
import { Icon }   from 'deriv-components';

const IconTradeType = ({ type, className }) => {
    switch (type.toLowerCase()) {
        case 'asiand'      : return <Icon icon='IcTradetypeAsiand'      className={className} color='brand' />;
        case 'asianu'      : return <Icon icon='IcTradetypeAsianu'      className={className} color='brand' />;
        case 'call_barrier': return <Icon icon='IcTradetypeCallBarrier' className={className} color='brand' />;
        case 'calle'       :
        case 'call'        : return <Icon icon='IcTradetypeCall'        className={className} color='brand' />;
        case 'callspread'  : return <Icon icon='IcTradetypeCallspread'  className={className} color='brand' />;
        case 'putspread'   : return <Icon icon='IcTradetypePutsread'    className={className} color='brand' />;
        case 'digitdiff'   : return <Icon icon='IcTradetypeDigitdiff'   className={className} color='brand' />;
        case 'digiteven'   : return <Icon icon='IcTradetypeDigiteven'   className={className} color='brand' />;
        case 'digitmatch'  : return <Icon icon='IcTradetypeDigitmatch'  className={className} color='brand' />;
        case 'digitodd'    : return <Icon icon='IcTradetypeDigitodd'    className={className} color='brand' />;
        case 'digitover'   : return <Icon icon='IcTradetypeDigitover'   className={className} color='brand' />;
        case 'digitunder'  : return <Icon icon='IcTradetypeDigitunder'  className={className} color='brand' />;
        case 'expirymiss'  : return <Icon icon='IcTradetypeExpirymiss'  className={className} color='brand' />;
        case 'expiryrangee':
        case 'expiryrange' : return <Icon icon='IcTradetypeExpiryrange' className={className} color='brand' />;
        case 'notouch'     : return <Icon icon='IcTradetypeNotouch'     className={className} color='brand' />;
        case 'onetouch'    : return <Icon icon='IcTradetypeOnetouch'    className={className} color='brand' />;
        case 'put_barrier' : return <Icon icon='IcTradetypePutBarrier'  className={className} color='brand' />;
        case 'pute'        :
        case 'put'         : return <Icon icon='IcTradetypePut'         className={className} color='brand' />;
        case 'range'       : return <Icon icon='IcTradetypeRange'       className={className} color='brand' />;
        case 'resetcall'   : return <Icon icon='IcTradetypeResetcall'   className={className} color='brand' />;
        case 'resetput'    : return <Icon icon='IcTradetypeResetput'    className={className} color='brand' />;
        case 'runhigh'     : return <Icon icon='IcTradetypeRunhigh'     className={className} color='brand' />;
        case 'runlow'      : return <Icon icon='IcTradetypeRunlow'      className={className} color='brand' />;
        case 'tickhigh'    : return <Icon icon='IcTradetypeTickhigh'    className={className} color='brand' />;
        case 'ticklow'     : return <Icon icon='IcTradetypeTicklow'     className={className} color='brand' />;
        case 'upordown'    : return <Icon icon='IcTradetypeUpordown'    className={className} color='brand' />;
        default            : return <Icon icon='IcTradetypeUnknown'     className={className} color='brand' />;
    }
};

IconTradeType.propTypes = {
    type: PropTypes.string,
};

export default IconTradeType;
