import PropTypes from 'prop-types';
import React     from 'react';
import { Icon }  from 'deriv-components';

const IconTradeType = ({ type, className }) => {
    switch (type.toLowerCase()) {
        case 'asiand'      : return <Icon icon='IcTradetypeAsiand'      className={className} color />;
        case 'asianu'      : return <Icon icon='IcTradetypeAsianu'      className={className} color />;
        case 'call_barrier': return <Icon icon='IcTradetypeCallBarrier' className={className} color />;
        case 'calle'       :
        case 'call'        : return <Icon icon='IcTradetypeCall'        className={className} color />;
        case 'callspread'  : return <Icon icon='IcTradetypeCallspread'  className={className} color />;
        case 'putspread'   : return <Icon icon='IcTradetypePutsread'    className={className} color />;
        case 'digitdiff'   : return <Icon icon='IcTradetypeDigitdiff'   className={className} color />;
        case 'digiteven'   : return <Icon icon='IcTradetypeDigiteven'   className={className} color />;
        case 'digitmatch'  : return <Icon icon='IcTradetypeDigitmatch'  className={className} color />;
        case 'digitodd'    : return <Icon icon='IcTradetypeDigitodd'    className={className} color />;
        case 'digitover'   : return <Icon icon='IcTradetypeDigitover'   className={className} color />;
        case 'digitunder'  : return <Icon icon='IcTradetypeDigitunder'  className={className} color />;
        case 'expirymiss'  : return <Icon icon='IcTradetypeExpirymiss'  className={className} color />;
        case 'expiryrangee':
        case 'expiryrange' : return <Icon icon='IcTradetypeExpiryrange' className={className} color />;
        case 'notouch'     : return <Icon icon='IcTradetypeNotouch'     className={className} color />;
        case 'onetouch'    : return <Icon icon='IcTradetypeOnetouch'    className={className} color />;
        case 'put_barrier' : return <Icon icon='IcTradetypePutBarrier'  className={className} color />;
        case 'pute'        :
        case 'put'         : return <Icon icon='IcTradetypePut'         className={className} color />;
        case 'range'       : return <Icon icon='IcTradetypeRange'       className={className} color />;
        case 'resetcall'   : return <Icon icon='IcTradetypeResetcall'   className={className} color />;
        case 'resetput'    : return <Icon icon='IcTradetypeResetput'    className={className} color />;
        case 'runhigh'     : return <Icon icon='IcTradetypeRunhigh'     className={className} color />;
        case 'runlow'      : return <Icon icon='IcTradetypeRunlow'      className={className} color />;
        case 'tickhigh'    : return <Icon icon='IcTradetypeTickhigh'    className={className} color />;
        case 'ticklow'     : return <Icon icon='IcTradetypeTicklow'     className={className} color />;
        case 'upordown'    : return <Icon icon='IcTradetypeUpordown'    className={className} color />;
        default            : return <Icon icon='IcTradetypeUnknown'     className={className} color />;
    }
};

IconTradeType.propTypes = {
    type: PropTypes.string,
};

export default IconTradeType;
