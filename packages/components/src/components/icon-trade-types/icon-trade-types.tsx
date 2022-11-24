import React from 'react';
import Icon from '../icon/icon';
import { TIconProps } from '../types';

type TIconTradeTypes = Omit<TIconProps, 'icon'> & {
    type: string;
    className?: string;
};

const IconTradeTypes = ({ type, className, ...props }: TIconTradeTypes) => {
    switch (type.toLowerCase()) {
        case 'asiand':
            return <Icon icon='IcTradetypeAsiand' className={className} color='brand' {...props} />;
        case 'asianu':
            return <Icon icon='IcTradetypeAsianu' className={className} color='brand' {...props} />;
        case 'call_barrier':
            return <Icon icon='IcTradetypeCallBarrier' className={className} color='brand' {...props} />;
        case 'calle':
            return <Icon icon='IcTradetypeCall' className={className} color='brand' {...props} />;
        case 'call':
            return <Icon icon='IcTradetypeCall' className={className} color='brand' {...props} />;
        case 'callspread':
            return <Icon icon='IcTradetypeCallspread' className={className} color='brand' {...props} />;
        case 'putspread':
            return <Icon icon='IcTradetypePutsread' className={className} color='brand' {...props} />;
        case 'digitdiff':
            return <Icon icon='IcTradetypeDigitdiff' className={className} color='brand' {...props} />;
        case 'digiteven':
            return <Icon icon='IcTradetypeDigiteven' className={className} color='brand' {...props} />;
        case 'digitmatch':
            return <Icon icon='IcTradetypeDigitmatch' className={className} color='brand' {...props} />;
        case 'digitodd':
            return <Icon icon='IcTradetypeDigitodd' className={className} color='brand' {...props} />;
        case 'digitover':
            return <Icon icon='IcTradetypeDigitover' className={className} color='brand' {...props} />;
        case 'digitunder':
            return <Icon icon='IcTradetypeDigitunder' className={className} color='brand' {...props} />;
        case 'expirymiss':
            return <Icon icon='IcTradetypeExpirymiss' className={className} color='brand' {...props} />;
        case 'expiryrangee':
        case 'expiryrange':
            return <Icon icon='IcTradetypeExpiryrange' className={className} color='brand' {...props} />;
        case 'lbfloatcall':
            return <Icon icon='IcTradetypeLbcall' className={className} color='brand' {...props} />;
        case 'lbfloatput':
            return <Icon icon='IcTradetypeLbput' className={className} color='brand' {...props} />;
        case 'lbhighlow':
            return <Icon icon='IcTradetypeLbhighlow' className={className} color='brand' {...props} />;
        case 'multdown':
            return <Icon icon='IcTradetypeMultdown' className={className} color='brand' {...props} />;
        case 'multup':
            return <Icon icon='IcTradetypeMultup' className={className} color='brand' {...props} />;
        case 'notouch':
            return <Icon icon='IcTradetypeNotouch' className={className} color='brand' {...props} />;
        case 'onetouch':
            return <Icon icon='IcTradetypeOnetouch' className={className} color='brand' {...props} />;
        case 'put_barrier':
            return <Icon icon='IcTradetypePutBarrier' className={className} color='brand' {...props} />;
        case 'pute':
            return <Icon icon='IcTradetypePut' className={className} color='brand' {...props} />;
        case 'put':
            return <Icon icon='IcTradetypePut' className={className} color='brand' {...props} />;
        case 'range':
            return <Icon icon='IcTradetypeRange' className={className} color='brand' {...props} />;
        case 'resetcall':
            return <Icon icon='IcTradetypeResetcall' className={className} color='brand' {...props} />;
        case 'resetput':
            return <Icon icon='IcTradetypeResetput' className={className} color='brand' {...props} />;
        case 'runhigh':
            return <Icon icon='IcTradetypeRunhigh' className={className} color='brand' {...props} />;
        case 'runlow':
            return <Icon icon='IcTradetypeRunlow' className={className} color='brand' {...props} />;
        case 'tickhigh':
            return <Icon icon='IcTradetypeTickhigh' className={className} color='brand' {...props} />;
        case 'ticklow':
            return <Icon icon='IcTradetypeTicklow' className={className} color='brand' {...props} />;
        case 'upordown':
            return <Icon icon='IcTradetypeUpordown' className={className} color='brand' {...props} />;
        default:
            return <Icon icon='IcUnknown' className={className} {...props} />;
    }
};

export default IconTradeTypes;
