import React from 'react';
import Icon from '../icon/icon';
import { TIconProps } from '../types';
import { CONTRACT_TYPES } from '@deriv/shared';

type TIconTradeTypes = Omit<TIconProps, 'icon'> & {
    type: string;
    className?: string;
};

const IconTradeTypes = ({ type, className, ...props }: TIconTradeTypes) => {
    switch (type.toUpperCase()) {
        case CONTRACT_TYPES.ACCUMULATOR:
            return <Icon icon='IcTradetypeAccu' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.ASIAN.DOWN:
            return <Icon icon='IcTradetypeAsiand' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.ASIAN.UP:
            return <Icon icon='IcTradetypeAsianu' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.CALL_BARRIER:
            return <Icon icon='IcTradetypeCallBarrier' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.CALLE:
        case CONTRACT_TYPES.CALL:
            return <Icon icon='IcTradetypeCall' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.CALL_PUT_SPREAD.CALL:
            return <Icon icon='IcTradetypeCallspread' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.CALL_PUT_SPREAD.PUT:
            return <Icon icon='IcTradetypePutsread' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.MATCH_DIFF.DIFF:
            return <Icon icon='IcTradetypeDigitdiff' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.EVEN_ODD.EVEN:
            return <Icon icon='IcTradetypeDigiteven' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.MATCH_DIFF.MATCH:
            return <Icon icon='IcTradetypeDigitmatch' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.EVEN_ODD.ODD:
            return <Icon icon='IcTradetypeDigitodd' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.OVER_UNDER.OVER:
            return <Icon icon='IcTradetypeDigitover' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.OVER_UNDER.UNDER:
            return <Icon icon='IcTradetypeDigitunder' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.END.OUT:
            return <Icon icon='IcTradetypeExpirymiss' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.EXPIRYRANGEE:
        case CONTRACT_TYPES.END.IN:
            return <Icon icon='IcTradetypeExpiryrange' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.LB_CALL:
            return <Icon icon='IcTradetypeLbcall' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.LB_PUT:
            return <Icon icon='IcTradetypeLbput' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.LB_HIGH_LOW:
            return <Icon icon='IcTradetypeLbhighlow' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.MULTIPLIER.DOWN:
            return <Icon icon='IcTradetypeMultdown' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.MULTIPLIER.UP:
            return <Icon icon='IcTradetypeMultup' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.TOUCH.NO_TOUCH:
            return <Icon icon='IcTradetypeNotouch' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.TOUCH.ONE_TOUCH:
            return <Icon icon='IcTradetypeOnetouch' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.PUT_BARRIER:
            return <Icon icon='IcTradetypePutBarrier' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.PUTE:
        case CONTRACT_TYPES.PUT:
            return <Icon icon='IcTradetypePut' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.STAY.IN:
            return <Icon icon='IcTradetypeRange' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.RESET.CALL:
            return <Icon icon='IcTradetypeResetcall' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.RESET.PUT:
            return <Icon icon='IcTradetypeResetput' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.RUN_HIGH_LOW.HIGH:
            return <Icon icon='IcTradetypeRunhigh' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.RUN_HIGH_LOW.LOW:
            return <Icon icon='IcTradetypeRunlow' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.TICK_HIGH_LOW.HIGH:
            return <Icon icon='IcTradetypeTickhigh' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.TICK_HIGH_LOW.LOW:
            return <Icon icon='IcTradetypeTicklow' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.TURBOS.LONG:
            return <Icon icon='IcTradetypeTurboslong' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.TURBOS.SHORT:
            return <Icon icon='IcTradetypeTurbosshort' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.STAY.OUT:
            return <Icon icon='IcTradetypeUpordown' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.VANILLA.CALL:
            return <Icon icon='IcTradetypeVanillaLongCall' className={className} color='brand' {...props} />;
        case CONTRACT_TYPES.VANILLA.PUT:
            return <Icon icon='IcTradetypeVanillaLongPut' className={className} color='brand' {...props} />;
        default:
            return <Icon icon='IcUnknown' className={className} {...props} />;
    }
};

export default IconTradeTypes;
